import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../../redux/actions/auth.actions";
import {
  Box,
  Container,
  Typography,
  Paper,
  Avatar,
  Button,
  TextField,
  Grid,
  Stack,
  Chip,
  Alert,
  Fade,
  CircularProgress,
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
} from "@mui/icons-material";

const SellerProfilePage = () => {
  const currentUser = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);
  const theme = useTheme();
  const [editable, setEditable] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    avatarUrl: currentUser?.avatarUrl || "",
  });
  const dispatch = useDispatch();

  useEffect(() => {
    setFormData({
      name: currentUser?.name || "",
      email: currentUser?.email || "",
      avatarUrl: currentUser?.avatarUrl || "",
    });
  }, [currentUser]);

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
      name: currentUser?.name || "",
      email: currentUser?.email || "",
      avatarUrl: currentUser?.avatarUrl || "",
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
        if (error && process.env.NODE_ENV === "development") {
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

  if (loading && !currentUser) {
    return (
      <Box sx={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Stack spacing={2} alignItems="center">
          <CircularProgress size={36} />
          <Typography variant="body2" color="text.secondary">
            Loading your profile...
          </Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: theme.palette.background.default,
        color: theme.palette.text.primary,
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        <Fade in={showSuccess}>
          <Alert severity="success" sx={{ mb: 3, borderRadius: 3 }} onClose={() => setShowSuccess(false)}>
            Profile updated successfully!
          </Alert>
        </Fade>

        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" fontWeight={800} sx={{ mb: 2 }}>
            Seller Profile
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your seller account details
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 4,
                mb: 3,
                background: "linear-gradient(135deg, #1f2937 0%, #111827 100%)",
                color: theme.palette.common.white,
                position: "relative",
                overflow: "hidden",
                border: `1px solid ${alpha(theme.palette.common.white, 0.08)}`,
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: -50,
                  right: -50,
                  width: 200,
                  height: 200,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.08)",
                  zIndex: 0,
                }}
              />
              <Box sx={{ position: "relative", zIndex: 1, textAlign: "center" }}>
                <Avatar
                  src={formData.avatarUrl}
                  sx={{
                    width: 120,
                    height: 120,
                    mx: "auto",
                    mb: 2,
                    border: "4px solid rgba(255,255,255,0.25)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
                  }}
                />
                <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
                  {formData.name || "Seller"}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.85, mb: 2 }}>
                  {formData.email}
                </Typography>
                <Chip
                  label={currentUser?.role || "Seller"}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.18)",
                    color: theme.palette.common.white,
                    fontWeight: 600,
                  }}
                />
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 4,
                border: `1px solid ${alpha(theme.palette.text.primary, 0.12)}`,
                bgcolor: alpha(theme.palette.background.paper, 0.95),
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 4 }}>
                <Typography variant="h6" fontWeight={700}>
                  Profile Information
                </Typography>
                {!editable && (
                  <Button
                    startIcon={<EditIcon />}
                    onClick={() => setEditable(true)}
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      fontWeight: 600,
                      px: 3,
                      py: 1,
                      borderRadius: 2,
                      "&:hover": { bgcolor: theme.palette.primary.dark },
                    }}
                  >
                    Edit Profile
                  </Button>
                )}
              </Box>

              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!editable}
                      InputProps={{
                        startAdornment: <PersonIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />,
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: theme.palette.primary.main,
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: theme.palette.primary.main,
                          },
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      name="email"
                      value={formData.email}
                      disabled
                      InputProps={{
                        startAdornment: <EmailIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />,
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          bgcolor: alpha(theme.palette.text.primary, 0.04),
                        },
                      }}
                      helperText="Email cannot be changed"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar src={formData.avatarUrl} sx={{ width: 60, height: 60 }} />
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
                            textTransform: "none",
                            color: theme.palette.primary.main,
                            fontWeight: 600,
                          }}
                        >
                          {formData.avatarUrl ? "Change Photo" : "Upload Photo"}
                        </Button>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>

                {editable && (
                  <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={loading ? <CircularProgress size={18} sx={{ color: "white" }} /> : <SaveIcon />}
                      disabled={loading}
                      sx={{
                        bgcolor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        fontWeight: 600,
                        px: 3,
                        "&:hover": { bgcolor: theme.palette.primary.dark },
                      }}
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<CancelIcon />}
                      onClick={handleCancel}
                      disabled={loading}
                      sx={{ textTransform: "none", fontWeight: 600 }}
                    >
                      Cancel
                    </Button>
                  </Stack>
                )}
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default SellerProfilePage;
