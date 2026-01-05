import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { userActions } from "../../../../redux/actions/user.actions";
import api from "../../../../redux/api";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  Snackbar,
  CircularProgress,
  Paper,
  InputAdornment,
  Tooltip,
  Grid
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  Store as StoreIcon,
  PersonAdd as UserIcon
} from "@mui/icons-material";

const AdminAllUsersPage = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  const users = useSelector((state) => state.user.users) || [];
  const loading = useSelector((state) => state.user.loading);
  
  // State for table
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  
  // Dialog states
  const [deleteDialog, setDeleteDialog] = useState({ open: false, userId: null, userName: '' });
  const [viewDialog, setViewDialog] = useState({ open: false, user: null });
  const [editDialog, setEditDialog] = useState({ open: false, user: null });
  const [editFormData, setEditFormData] = useState({ status: 'Active', isApproved: 'Approved' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    // Only fetch if users array is empty and not currently loading to prevent duplicate calls
    if (users.length === 0 && !loading) {
    dispatch(userActions.getAllUsersForAdmin());
    }
  }, [dispatch, users.length, loading]);

  // Filter users based on search and role
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Pagination
  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteUser = async () => {
    // Prevent deleting the current admin
    if (deleteDialog.userId === currentUser?._id) {
      setSnackbar({
        open: true,
        message: 'You cannot delete your own account',
        severity: 'error'
      });
      setDeleteDialog({ open: false, userId: null, userName: '' });
      return;
    }

    // Get the user being deleted
    const userToDelete = users.find(u => u._id === deleteDialog.userId);
    
    // Prevent deleting other admins
    if (userToDelete?.role === 'Admin') {
      setSnackbar({
        open: true,
        message: 'Cannot delete other admin users',
        severity: 'error'
      });
      setDeleteDialog({ open: false, userId: null, userName: '' });
      return;
    }

    try {
      await dispatch(userActions.deleteForAdmin(deleteDialog.userId));
      setSnackbar({
        open: true,
        message: 'User deleted successfully',
        severity: 'success'
      });
      dispatch(userActions.getAllUsersForAdmin()); // Refresh data
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error deleting user',
        severity: 'error'
      });
    }
    setDeleteDialog({ open: false, userId: null, userName: '' });
  };

  const handleViewUser = (user) => {
    setViewDialog({ open: true, user });
  };

  const handleEditUser = (user) => {
    setEditDialog({ open: true, user });
    // Initialize form data with current user values
    // Use isActive for status (isDeleted is for permanent deletion, not status)
    setEditFormData({
      status: user.isActive !== false ? 'Active' : 'Inactive', // Default to Active if undefined
      // Only initialize isApproved for sellers (other users are auto-approved)
      isApproved: user.role === 'Seller' 
        ? (user.isApproved ? 'Approved' : 'Pending')
        : 'Approved' // Non-sellers are always approved (not used, but for consistency)
    });
  };

  const handleUpdateUser = async () => {
    if (!editDialog.user) return;

    try {
      // Prepare update data
      // Use isActive for status toggle (not isDeleted - that's for permanent deletion)
      const updateData = {
        isActive: editFormData.status === 'Active'
      };

      // Add isApproved if user is a Seller
      if (editDialog.user.role === 'Seller') {
        updateData.isApproved = editFormData.isApproved === 'Approved';
      }

      // Make API call to update user
      await api.put(`/auth/admin/user/${editDialog.user._id}`, updateData);

      setSnackbar({
        open: true,
        message: 'User updated successfully',
        severity: 'success'
      });
      setEditDialog({ open: false, user: null });
      dispatch(userActions.getAllUsersForAdmin()); // Refresh data
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error updating user:', error);
      }
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error updating user',
        severity: 'error'
      });
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Admin':
        return <AdminIcon />;
      case 'Seller':
        return <StoreIcon />;
      default:
        return <UserIcon />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Admin':
        return 'error';
      case 'Seller':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          User Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage all users, their roles, and permissions
        </Typography>
      </Box>

      {/* Filters and Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 250 }}
            />
            <TextField
              select
              label="Filter by Role"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="all">All Roles</MenuItem>
              <MenuItem value="User">User</MenuItem>
              <MenuItem value="Seller">Seller</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
            </TextField>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => dispatch(userActions.getAllUsersForAdmin())}
            >
              Refresh
              </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Joined</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedUsers.map((user) => (
                  <TableRow key={user._id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                          {user.name?.charAt(0)?.toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {user.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            ID: {user._id.slice(-8)}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {user.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getRoleIcon(user.role)}
                        label={user.role}
                        color={getRoleColor(user.role)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.isActive !== false ? 'Active' : 'Inactive'}
                        color={user.isActive !== false ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="View Details">
                        <IconButton 
                          size="small"
                          onClick={() => handleViewUser(user)}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit User">
                        <IconButton 
                          size="small"
                          onClick={() => handleEditUser(user)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      {user.role !== 'Admin' && user._id !== currentUser?._id && (
                        <Tooltip title="Delete User">
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => setDeleteDialog({ 
                              open: true, 
                              userId: user._id, 
                              userName: user.name 
                            })}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </CardContent>
      </Card>

      {/* Delete User Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, userId: null, userName: '' })}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete user "{deleteDialog.userName}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, userId: null, userName: '' })}>
            Cancel
          </Button>
          <Button onClick={handleDeleteUser} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* View User Details Dialog */}
      <Dialog 
        open={viewDialog.open} 
        onClose={() => setViewDialog({ open: false, user: null })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>User Details</DialogTitle>
        <DialogContent>
          {viewDialog.user && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Basic Information</Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Name</Typography>
                    <Typography variant="body1">{viewDialog.user.name}</Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Email</Typography>
                    <Typography variant="body1">{viewDialog.user.email}</Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Role</Typography>
                    <Chip
                      icon={getRoleIcon(viewDialog.user.role)}
                      label={viewDialog.user.role}
                      color={getRoleColor(viewDialog.user.role)}
                      size="small"
                    />
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Status</Typography>
                    <Chip
                      label={viewDialog.user.isActive !== false ? 'Active' : 'Inactive'}
                      color={viewDialog.user.isActive !== false ? 'success' : 'error'}
                      size="small"
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Account Information</Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">User ID</Typography>
                    <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                      {viewDialog.user._id}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Joined Date</Typography>
                    <Typography variant="body1">
                      {new Date(viewDialog.user.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Last Updated</Typography>
                    <Typography variant="body1">
                      {new Date(viewDialog.user.updatedAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                  {viewDialog.user.role === 'Seller' && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Seller Status</Typography>
                      <Chip
                        label={viewDialog.user.isApproved ? 'Approved' : 'Pending Approval'}
                        color={viewDialog.user.isApproved ? 'success' : 'warning'}
                        size="small"
                      />
                    </Box>
                  )}
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialog({ open: false, user: null })}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog 
        open={editDialog.open} 
        onClose={() => setEditDialog({ open: false, user: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          {editDialog.user && (
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Name"
                defaultValue={editDialog.user.name}
                margin="normal"
                disabled
              />
              <TextField
                fullWidth
                label="Email"
                defaultValue={editDialog.user.email}
                margin="normal"
                disabled
              />
              <TextField
                select
                fullWidth
                label="Role"
                defaultValue={editDialog.user.role}
                margin="normal"
                disabled
              >
                <MenuItem value="User">User</MenuItem>
                <MenuItem value="Seller">Seller</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
              </TextField>
              <TextField
                select
                fullWidth
                label="Account Status"
                value={editFormData.status}
                onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                margin="normal"
                helperText="Inactive users cannot log in but their data is preserved"
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </TextField>
              {editDialog.user.role === 'Seller' && (
                <TextField
                  select
                  fullWidth
                  label="Seller Approval"
                  value={editFormData.isApproved}
                  onChange={(e) => setEditFormData({ ...editFormData, isApproved: e.target.value })}
                  margin="normal"
                >
                  <MenuItem value="Approved">Approved</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                </TextField>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog({ open: false, user: null })}>
            Cancel
          </Button>
          <Button onClick={handleUpdateUser} color="primary" variant="contained">
            Update User
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ open: false, message: '', severity: 'success' })}
      >
        <Alert
          onClose={() => setSnackbar({ open: false, message: '', severity: 'success' })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminAllUsersPage;
