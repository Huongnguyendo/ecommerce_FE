import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
<<<<<<< HEAD
=======
import { Row, Col, Button, Form, ButtonGroup } from "react-bootstrap";
>>>>>>> master
import { authActions } from "../../redux/actions/auth.actions";
import {
  Box,
  Container,
  Typography,
  Paper,
  Avatar,
  Button,
  TextField,
  Card,
  CardContent,
  Grid,
  Stack,
  Chip,
  Divider,
  IconButton,
  CircularProgress,
  Alert,
  Fade,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PhotoCamera as PhotoCameraIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Badge as BadgeIcon,
  Security as SecurityIcon,
  ShoppingBag as ShoppingBagIcon,
  Favorite as FavoriteIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { useHistory } from "react-router-dom";

const ProfilePage = () => {
  const currentUser = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);
  const [editable, setEditable] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    avatarUrl: currentUser?.avatarUrl || '',
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const dispatch = useDispatch();
<<<<<<< HEAD
  const history = useHistory();
  const theme = useTheme();
=======

  // let [avatarUrl, setAvatarUrl] = useState("");
>>>>>>> master

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, avatarUrl } = formData;
    dispatch(authActions.updateProfile(name, avatarUrl));
    setEditable(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
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
        if (error && process.env.NODE_ENV === 'development') {
          console.log(error);
        }
        if (result.event === "success") {
          setFormData({
            ...formData,
            avatarUrl: result.info.secure_url,
          });
        }
      }
    );
  };

<<<<<<< HEAD
  const quickActions = [
    {
      title: "Order History",
      icon: <HistoryIcon />,
      color: "#2196f3",
      onClick: () => history.push("/user/history"),
    },
    {
      title: "Wishlist",
      icon: <FavoriteIcon />,
      color: "#f44336",
      onClick: () => history.push("/wishlist"),
    },
    {
      title: "Cart",
      icon: <ShoppingBagIcon />,
      color: "#4caf50",
      onClick: () => history.push("/cart"),
    },
  ];

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        bgcolor: '#f8fafb'
      }}>
        <Stack alignItems="center" spacing={2}>
          <CircularProgress size={60} sx={{ color: '#00bfae' }} />
          <Typography variant="h6" color="text.secondary">
            Loading your profile...
          </Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafb', py: 6 }}>
      <Container maxWidth="lg">
        {/* Success Alert */}
        <Fade in={showSuccess}>
          <Alert 
            severity="success" 
            sx={{ mb: 3, borderRadius: 3 }}
            onClose={() => setShowSuccess(false)}
          >
            Profile updated successfully!
          </Alert>
        </Fade>

        {/* Header Section */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" fontWeight={800} sx={{ mb: 2, color: '#222' }}>
            My Profile
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your account settings and preferences
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Left Column - Profile Info */}
          <Grid item xs={12} md={4}>
            {/* Profile Card */}
            <Paper elevation={0} sx={{ 
              p: 4, 
              borderRadius: 4, 
              mb: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Background Pattern */}
              <Box sx={{
                position: 'absolute',
                top: -50,
                right: -50,
                width: 200,
                height: 200,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
                zIndex: 0
              }} />
              
              <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                <Avatar
                  src={formData.avatarUrl}
                  sx={{ 
                    width: 120, 
                    height: 120, 
                    mx: 'auto', 
                    mb: 2,
                    border: '4px solid rgba(255,255,255,0.3)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
                  }}
                />
                <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
                  {formData.name || 'User'}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
                  {formData.email}
                </Typography>
                <Chip
                  label={currentUser?.role || 'User'}
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    color: 'white',
                    fontWeight: 600
                  }}
                />
              </Box>
            </Paper>

            {/* Quick Actions */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e0e0e0' }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 3, color: '#222' }}>
                Quick Actions
              </Typography>
              <Stack spacing={2}>
                {quickActions.map((action, index) => (
=======
  useEffect(() => {}, [handleSubmit]);

  return (
    <div fluid className="userProfilePage">
      <Row className="d-flex justify-content-center align-items-center">
        <Col md={{ span: 8 }}>
          {loading ? (
            <div className="d-flex justify-content-center align-items-center">
              Loading...
              {/* <ClipLoader color="#f86c6b" size={150} loading={true} /> */}
            </div>
          ) : (
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <div className="text-center">
                  {formData.avatarUrl && (
                    <div className="mb-3 profileImg">
                      <img
                        src={
                          formData.avatarUrl
                            ? formData.avatarUrl
                            : "https://lh3.googleusercontent.com/proxy/6XSzNgIYVLWue7bahUshLuO6MDh-7a-2iYWCmnIJnmMHcoOgj4r9Gn9pRHXotfaDyTIqid8Es0U8MHUqZpe2F4n0ImUbjlM"
                        }
                        className="avatar-lg"
                        alt="avatar"
                      />
                    </div>
                  )}
>>>>>>> master
                  <Button
                    key={index}
                    startIcon={action.icon}
                    onClick={action.onClick}
                    sx={{
                      justifyContent: 'flex-start',
                      textTransform: 'none',
                      color: '#666',
                      fontWeight: 600,
                      py: 1.5,
                      px: 2,
                      borderRadius: 2,
                      '&:hover': {
                        bgcolor: alpha(action.color, 0.1),
                        color: action.color
                      }
                    }}
                  >
                    {action.title}
                  </Button>
                ))}
              </Stack>
            </Paper>
          </Grid>

          {/* Right Column - Profile Form */}
          <Grid item xs={12} md={8}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #e0e0e0' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
                <Typography variant="h6" fontWeight={700} sx={{ color: '#222' }}>
                  Profile Information
                </Typography>
                {!editable && (
                  <Button
                    startIcon={<EditIcon />}
                    onClick={() => setEditable(true)}
                    sx={{
                      bgcolor: '#00bfae',
                      color: 'white',
                      fontWeight: 600,
                      px: 3,
                      py: 1,
                      borderRadius: 2,
                      '&:hover': { bgcolor: '#43e6c2' }
                    }}
                  >
                    Edit Profile
                  </Button>
                )}
              </Box>

              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  {/* Name Field */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!editable}
                      InputProps={{
                        startAdornment: <PersonIcon sx={{ mr: 1, color: '#666' }} />
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#00bfae',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#00bfae',
                          },
                        }
                      }}
                    />
                  </Grid>

                  {/* Email Field */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email Address"
                    name="email"
                    value={formData.email}
                    disabled={true}
                      InputProps={{
                        startAdornment: <EmailIcon sx={{ mr: 1, color: '#666' }} />
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          bgcolor: '#f5f5f5'
                        }
                      }}
                      helperText="Email cannot be changed"
                    />
                  </Grid>

                  {/* Avatar Upload */}
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        src={formData.avatarUrl}
                        sx={{ width: 60, height: 60 }}
                      />
                      <Box>
                        <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                          Profile Picture
                        </Typography>
                        <Button
                          startIcon={<PhotoCameraIcon />}
                          onClick={uploadWidget}
                          disabled={!editable}
                          size="small"
                          sx={{
                            textTransform: 'none',
                            color: '#00bfae',
                            fontWeight: 600
                          }}
                        >
                          {formData.avatarUrl ? 'Change Photo' : 'Upload Photo'}
                        </Button>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>

                {/* Action Buttons */}
              {editable && (
                  <Box sx={{ display: 'flex', gap: 2, mt: 4, pt: 3, borderTop: '1px solid #e0e0e0' }}>
                    <Button
                      type="submit"
                      startIcon={loading ? <CircularProgress size={16} /> : <SaveIcon />}
                      disabled={loading}
                      sx={{
                        bgcolor: '#00bfae',
                        color: 'white',
                        fontWeight: 600,
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                        '&:hover': { bgcolor: '#43e6c2' },
                        '&:disabled': { bgcolor: '#e0e0e0' }
                      }}
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  <Button
                      startIcon={<CancelIcon />}
                    onClick={handleCancel}
                    disabled={loading}
                      sx={{
                        color: '#666',
                        fontWeight: 600,
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                        border: '1px solid #e0e0e0',
                        '&:hover': { bgcolor: '#f5f5f5' }
                      }}
                  >
                    Cancel
                  </Button>
                  </Box>
                )}
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ProfilePage;
