import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../../redux/actions/auth.actions";
import {
  Container,
  Box,
  Card,
  CardContent,
  Avatar,
  Typography,
  Button,
  TextField,
  Stack,
  Divider,
  Grid,
  IconButton,
  CircularProgress,
  Alert,
  Snackbar
} from "@mui/material";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  CloudUpload as UploadIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  PhotoCamera as PhotoCameraIcon
} from "@mui/icons-material";

const AdminProfilePage = () => {
  const currentUser = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);
  const [editable, setEditable] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    avatarUrl: currentUser?.avatarUrl || '',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, avatarUrl } = formData;
    dispatch(authActions.updateProfile(name, avatarUrl));
    setEditable(false);
    setSnackbar({
      open: true,
      message: 'Profile updated successfully',
      severity: 'success'
    });
  };

  const handleCancel = () => {
    setFormData({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      avatarUrl: currentUser?.avatarUrl || '',
    });
    setEditable(false);
  };

  const uploadWidget = () => {
    window.cloudinary.openUploadWidget(
      {
        cloud_name: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
        upload_preset: process.env.REACT_APP_CLOUDINARY_PRESET,
        tags: ["userAvatar"],
      },
      function (error, result) {
        if (error) {
          if (process.env.NODE_ENV === 'development') {
            console.log(error);
          }
          setSnackbar({
            open: true,
            message: 'Error uploading image',
            severity: 'error'
          });
        }
        if (result && result.event === "success") {
          setFormData({
            ...formData,
            avatarUrl: result.info.secure_url,
          });
          setSnackbar({
            open: true,
            message: 'Avatar uploaded successfully',
            severity: 'success'
          });
        }
      }
    );
  };

  if (!currentUser) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          fontWeight="bold" 
          gutterBottom
          sx={{
            background: 'linear-gradient(45deg, #12efc8 30%, #f2b455 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Admin Profile
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your account settings and profile information
        </Typography>
      </Box>

      <Card elevation={3}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {/* Avatar Section */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <Avatar
                        src={formData.avatarUrl}
                  alt={currentUser.name}
                  sx={{
                    width: 150,
                    height: 150,
                    bgcolor: 'primary.main',
                    fontSize: 64,
                    mb: 2,
                  }}
                >
                  {!formData.avatarUrl && <PersonIcon sx={{ fontSize: 80 }} />}
                </Avatar>
                {editable && (
                  <IconButton
                    onClick={uploadWidget}
                    sx={{
                      position: 'absolute',
                      bottom: 20,
                      right: -10,
                      bgcolor: 'primary.main',
                      border: '3px solid',
                      borderColor: 'background.paper',
                      '&:hover': {
                        bgcolor: 'primary.dark',
                      },
                    }}
                  >
                    <PhotoCameraIcon />
                  </IconButton>
                )}
              </Box>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {currentUser.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Administrator
              </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Profile Information */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!editable}
                  InputProps={{
                    startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                    name="email"
                    value={formData.email}
                    disabled={true}
                  InputProps={{
                    startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="User ID"
                  value={currentUser._id}
                  disabled={true}
                  InputProps={{
                    sx: { fontFamily: 'monospace' }
                  }}
                  helperText="This is your unique user identifier"
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Action Buttons */}
            <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
              {!editable ? (
                    <Button
                  variant="contained"
                  size="large"
                  startIcon={<EditIcon />}
                  onClick={() => setEditable(true)}
                  sx={{
                    background: 'linear-gradient(135deg, #12efc8 0%, #0ebfa0 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #0ebfa0 0%, #0b8f78 100%)',
                    },
                  }}
                >
                  Edit Profile
                    </Button>
                  ) : (
                <>
                  <Button
                    variant="contained"
                    size="large"
                    type="submit"
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                    disabled={loading}
                    sx={{
                      background: 'linear-gradient(135deg, #12efc8 0%, #0ebfa0 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #0ebfa0 0%, #0b8f78 100%)',
                      },
                    }}
                  >
                    Save Changes
                    </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={handleCancel}
                    disabled={loading}
                    startIcon={<CancelIcon />}
                    sx={{
                      borderColor: 'text.secondary',
                      color: 'text.primary',
                      '&:hover': {
                        borderColor: 'text.secondary',
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    Cancel
                  </Button>
                </>
              )}
              {editable && (
                <Button
                  variant="outlined"
                  size="large"
                  onClick={uploadWidget}
                  startIcon={<UploadIcon />}
                  disabled={loading}
                  sx={{
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    '&:hover': {
                      borderColor: 'primary.dark',
                      bgcolor: 'primary.main',
                      color: '#000',
                    },
                  }}
                >
                  Change Avatar
                </Button>
              )}
            </Stack>
          </form>
        </CardContent>
      </Card>

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

export default AdminProfilePage;
