import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { authActions, routeActions } from "../redux/actions";
<<<<<<< HEAD
import { Box, Paper, Typography, TextField, Button, Alert, CircularProgress, Divider, MenuItem, Avatar, ToggleButton, ToggleButtonGroup } from "@mui/material";
import shopnow from '../images/shopnow.png';
=======
// import { routeActions } from "redux/actions/route.actions";
import Select from "react-select";
import { FormGroup } from "@material-ui/core";
import PublicNavbar from "./PublicNavbar";
import { ToastContainer, toast } from "react-toastify";
>>>>>>> master

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
    avatarUrl: "",
    role: "User",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });
<<<<<<< HEAD
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
=======
>>>>>>> master

  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);
  const redirectTo = useSelector((state) => state.route.redirectTo);
  const history = useHistory();
  const error = useSelector((state) => state.auth.error);

  const error = useSelector((state) => state.auth.error);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, password, password2, avatarUrl, role } = formData;
    if (password !== password2) {
      setErrors({ ...errors, password2: "Passwords do not match" });
      return;
    }
    if (password.length < 3) {
      setErrors({
        ...errors,
        password: "Password must be longer than 3 characters",
      });
      return;
    }
    dispatch(authActions.register(name, email, password, avatarUrl, role));
  };

  useEffect(() => {
    if (redirectTo) {
      if (redirectTo === "__GO_BACK__") {
        history.goBack();
        dispatch(routeActions.removeRedirectTo());
      } else {
        history.push(redirectTo);
        dispatch(routeActions.removeRedirectTo());
      }
    }
  }, [dispatch, history, redirectTo]);

  const uploadWidget = () => {
    window.cloudinary.openUploadWidget(
      {
        cloud_name: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
        upload_preset: process.env.REACT_APP_CLOUDINARY_PRESET,
        tags: ["productImg"],
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

  return (
<<<<<<< HEAD
    <Box sx={{ minHeight: '100vh',
      bgcolor: 'linear-gradient(135deg, #e0f7fa 0%, #f4f8fb 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', py: 8 }}>
      <Paper elevation={6} sx={{ p: { xs: 3, sm: 5 }, borderRadius: 5, maxWidth: 440, width: '100%', boxShadow: '0 8px 32px 0 rgba(30,144,255,0.10)' }}>
        <Box sx={{ mb: 2, textAlign: 'center' }}>
          <Box component="img" src={shopnow} alt="Logo" sx={{ width: 100, height: 100 }} />
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
            Create your account
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
          )}
        </Box>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
            <Avatar src={formData.avatarUrl} sx={{ width: 64, height: 64, mb: 1, bgcolor: '#e0e7ef', fontSize: 32 }} />
            <Button variant="outlined" size="small" onClick={uploadWidget} sx={{ mb: 1, fontWeight: 600 }}>
              {formData.avatarUrl ? 'Change Avatar' : 'Add Avatar'}
            </Button>
          </Box>
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            error={!!errors.password}
            helperText={errors.password}
            inputProps={{ minLength: 3 }}
            InputProps={{
              endAdornment: (
                <Button onClick={() => setShowPassword(v => !v)} size="small" sx={{ minWidth: 0, px: 1 }}>
                  {showPassword ? 'Hide' : 'Show'}
                </Button>
              )
            }}
          />
          <TextField
            label="Confirm Password"
            type={showPassword2 ? 'text' : 'password'}
            name="password2"
            value={formData.password2}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            error={!!errors.password2}
            helperText={errors.password2}
            InputProps={{
              endAdornment: (
                <Button onClick={() => setShowPassword2(v => !v)} size="small" sx={{ minWidth: 0, px: 1 }}>
                  {showPassword2 ? 'Hide' : 'Show'}
                </Button>
              )
            }}
          />
          {/* Role selection */}
          <ToggleButtonGroup
            color="primary"
            value={formData.role}
            exclusive
            onChange={(e, value) => {
              if (value) setFormData({ ...formData, role: value });
            }}
            fullWidth
            sx={{ mb: 2, mt: 2 }}
          >
            <ToggleButton value="User" sx={{ fontWeight: 600 }}>User</ToggleButton>
            <ToggleButton value="Seller" sx={{ fontWeight: 600 }}>Seller</ToggleButton>
          </ToggleButtonGroup>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{ mt: 2, borderRadius: 3, fontWeight: 700, py: 1.5, boxShadow: '0 4px 16px 0 rgba(30,144,255,0.10)' }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
          </Button>
        </form>
        <Box sx={{ my: 3 }}>
          <Divider>or</Divider>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 600 }}>
            Log In
          </Link>
        </Typography>
      </Paper>
    </Box>
=======
    <div>
      <Container>
        <Row>
          <Col md={{ span: 6, offset: 3 }}>
            <div className="text-center mb-3 mt-5">
              <h1 className="text-primary">Register</h1>
              <p className="lead">
                <FontAwesomeIcon icon="user" size="1x" /> Create Your Account
              </p>
              <p className="text-muted">
                <sup>
                  <i
                    className="fa fa-star"
                    style={{ fontSize: "10px", color: "red" }}
                  ></i>
                </sup>
                All fields are required{" "}
              </p>
              {error && (
                <small className="form-text text-danger">{error}</small>
              )}
            </div>
            {/* <ToastContainer /> */}
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Button
                  variant="info"
                  className="btn-block w-100 "
                  onClick={uploadWidget}
                >
                  Add avatar
                </Button>
              </Form.Group>
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && (
                  <small className="form-text text-danger">{errors.name}</small>
                )}
              </Form.Group>
              <Form.Group>
                <Form.Control
                  type="email"
                  placeholder="Email Address"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <small className="form-text text-danger">
                    {errors.email}
                  </small>
                )}
              </Form.Group>
              <Form.Group>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && (
                  <small className="form-text text-danger">
                    {errors.password}
                  </small>
                )}
              </Form.Group>
              <Form.Group>
                <Form.Control
                  type="password"
                  placeholder="Confirm Password"
                  name="password2"
                  value={formData.password2}
                  onChange={handleChange}
                />
                {errors.password2 && (
                  <small className="form-text text-danger">
                    {errors.password2}
                  </small>
                )}
              </Form.Group>
              <FormGroup>
                <select
                  name="role"
                  id="roles"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="User">User</option>
                  <option value="Seller">Seller</option>
                </select>
              </FormGroup>

              {loading ? (
                <Button
                  className="btn-block"
                  variant="primary"
                  type="button"
                  disabled
                >
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                    style={{ textAlign: "center" }}
                  ></span>
                  loading...
                </Button>
              ) : (
                <Button
                  className="btn-block mt-3 mb-2"
                  type="submit"
                  variant="primary"
                >
                  Register
                </Button>
              )}

              <p style={{ textAlign: "center" }}>
                Already have an account? <Link to="/login">Log In</Link>
              </p>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
>>>>>>> master
  );
};

export default RegisterPage;
