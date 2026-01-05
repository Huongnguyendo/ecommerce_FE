import React, { useState, useEffect } from 'react';
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
  TextField,
  MenuItem,
  Alert,
  Snackbar,
  CircularProgress,
  Paper,
  InputAdornment,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Store as StoreIcon,
  Person as PersonIcon,
  AttachMoney as MoneyIcon,
  Inventory as InventoryIcon
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import api from '../../../../redux/api';

const AdminSellersPage = () => {
  const dispatch = useDispatch();
  
  // State for sellers
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // State for table
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Dialog states
  const [approvalDialog, setApprovalDialog] = useState({ open: false, seller: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/auth/admin/allusers');
      const allUsers = response.data.data.users || [];
      const sellerUsers = allUsers.filter(user => user.role === 'Seller');
      setSellers(sellerUsers);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching sellers:', error);
      }
      setSnackbar({
        open: true,
        message: 'Error loading sellers',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter sellers based on search and status
  const filteredSellers = sellers.filter(seller => {
    const matchesSearch = seller.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         seller.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'approved' && seller.isApproved) ||
                         (statusFilter === 'pending' && !seller.isApproved);
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const paginatedSellers = filteredSellers.slice(
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

  const handleApproveSeller = async () => {
    try {
      // Update seller approval status via admin API
      await api.put(`/auth/admin/user/${approvalDialog.seller._id}`, {
        isApproved: true
      });
      
      // Update local state
      setSellers(prevSellers => 
        prevSellers.map(seller => 
          seller._id === approvalDialog.seller._id 
            ? { ...seller, isApproved: true }
            : seller
        )
      );
      
      setSnackbar({
        open: true,
        message: 'Seller approved successfully',
        severity: 'success'
      });
      setApprovalDialog({ open: false, seller: null });
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error approving seller:', error);
      }
      setSnackbar({
        open: true,
        message: 'Error approving seller',
        severity: 'error'
      });
    }
  };

  const handleRejectSeller = async (seller) => {
    try {
      // Update seller approval status via admin API
      await api.put(`/auth/admin/user/${seller._id}`, {
        isApproved: false
      });
      
      // Update local state
      setSellers(prevSellers => 
        prevSellers.map(s => 
          s._id === seller._id 
            ? { ...s, isApproved: false }
            : s
        )
      );
      
      setSnackbar({
        open: true,
        message: 'Seller rejected successfully',
        severity: 'success'
      });
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error rejecting seller:', error);
      }
      setSnackbar({
        open: true,
        message: 'Error rejecting seller',
        severity: 'error'
      });
    }
  };

  const getStatusColor = (seller) => {
    if (seller.isApproved) return 'success';
    return 'warning';
  };

  const getStatusText = (seller) => {
    if (seller.isApproved) return 'Approved';
    return 'Pending Approval';
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
          Seller Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Approve and manage seller accounts
        </Typography>
      </Box>

      {/* Filters and Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search sellers..."
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
              label="Filter by Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="all">All Sellers</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="pending">Pending Approval</MenuItem>
            </TextField>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchSellers}
            >
              Refresh
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Sellers Table */}
      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Seller</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Products</TableCell>
                  <TableCell>Revenue</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Joined</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedSellers.map((seller) => (
                  <TableRow key={seller._id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2, bgcolor: 'warning.main' }}>
                          {seller.name?.charAt(0)?.toUpperCase() || <StoreIcon />}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {seller.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            ID: {seller._id.slice(-8)}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {seller.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <InventoryIcon sx={{ mr: 1, fontSize: 16 }} />
                        <Typography variant="body2">
                          {seller.productCount || 0}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <MoneyIcon sx={{ mr: 1, fontSize: 16 }} />
                        <Typography variant="body2">
                          ${seller.totalRevenue || '0.00'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusText(seller)}
                        color={getStatusColor(seller)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(seller.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="View Seller Details">
                        <IconButton size="small">
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      {!seller.isApproved && (
                        <Tooltip title="Approve Seller">
                          <IconButton 
                            size="small" 
                            color="success"
                            onClick={() => setApprovalDialog({ open: true, seller })}
                          >
                            <CheckCircleIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      {!seller.isApproved && (
                        <Tooltip title="Reject Seller">
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleRejectSeller(seller)}
                          >
                            <CancelIcon />
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
            count={filteredSellers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </CardContent>
      </Card>

      {/* Approval Dialog */}
      <Dialog open={approvalDialog.open} onClose={() => setApprovalDialog({ open: false, seller: null })}>
        <DialogTitle>Approve Seller</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to approve seller "{approvalDialog.seller?.name}"? 
            This will activate their account and allow them to start selling.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApprovalDialog({ open: false, seller: null })}>
            Cancel
          </Button>
          <Button onClick={handleApproveSeller} color="success" variant="contained">
            Approve
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

export default AdminSellersPage;
