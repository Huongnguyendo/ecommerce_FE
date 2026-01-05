import React, { useState } from "react";
<<<<<<< HEAD
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "redux/actions";
import { Redirect, Link } from "react-router-dom";
import { Box, Paper, Typography, TextField, Button, Alert, CircularProgress, Divider } from "@mui/material";
import shopnow from '../images/shopnow.png';
=======
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Redirect, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "redux/actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { REACT_APP_FB, REACT_APP_GG } from "../../constants";
import FacebookLogin from "react-facebook-login";
import GoogleLogin from "react-google-login";
import { ToastContainer, toast } from "react-toastify";
import "../App.css";
>>>>>>> master

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);
  const loginError = useSelector((state) => state.auth.error);
<<<<<<< HEAD
  const [showPassword, setShowPassword] = useState(false);
=======
>>>>>>> master

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = formData;
    dispatch(authActions.loginRequest(email, password));
  };

  // log in with facebook
  // send the token to backend via redux
  const loginWithFacebook = (response) => {
    dispatch(authActions.loginFacebookRequest(response.accessToken));
  };

  const loginWithGoogle = (response) => {
    dispatch(authActions.loginGoogleRequest(response.accessToken));
  };

<<<<<<< HEAD
  // Redirect based on user role
  if (isAuthenticated) {
    if (user && user.role === "Admin") {
      return <Redirect to="/admin" />;
    } else if (user && user.role === "Seller") {
      return <Redirect to="/seller" />;
    } else {
      return <Redirect to="/" />;
    }
  }

  return (
    <Box sx={{ minHeight: '100vh',
      bgcolor: 'linear-gradient(135deg, #e0f7fa 0%, #f4f8fb 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', py: 8 }}>
      <Paper elevation={6} sx={{ p: { xs: 3, sm: 5 }, borderRadius: 5, maxWidth: 420, width: '100%', boxShadow: '0 8px 32px 0 rgba(30,144,255,0.10)' }}>
        <Box sx={{ mb: 2, textAlign: 'center' }}>
          <Box component="img" src={shopnow} alt="Logo" sx={{ width: 100, height: 100 }} />
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
            Sign into your account
          </Typography>
          {loginError && (
            <Alert severity="error" sx={{ mb: 2 }}>{loginError}</Alert>
          )}
        </Box>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            autoComplete="email"
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
            autoComplete="current-password"
            inputProps={{ minLength: 3 }}
            InputProps={{
              endAdornment: (
                <Button onClick={() => setShowPassword(v => !v)} size="small" sx={{ minWidth: 0, px: 1 }}>
                  {showPassword ? 'Hide' : 'Show'}
                </Button>
              )
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{ mt: 2, borderRadius: 3, fontWeight: 700, py: 1.5, boxShadow: '0 4px 16px 0 rgba(30,144,255,0.10)' }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
          </Button>
        </form>
        <Box sx={{ my: 3 }}>
          <Divider>or</Divider>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
          Don&apos;t have an account?{' '}
          <Link to="/register" style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 600 }}>
            Register
          </Link>
        </Typography>
      </Paper>
    </Box>
=======
  if (isAuthenticated) return <Redirect to="/" />;

  return (
    <>
      <Container>
        {/* <ToastContainer /> */}
        <Row>
          <Col md={{ span: 6, offset: 3 }}>
            <Form onSubmit={handleSubmit}>
              <div className="text-center mb-3 mt-5">
                <h1 className="text-primary">Log In</h1>
                <p className="lead">
                  <FontAwesomeIcon icon="user" size="1x" /> Sign Into Your
                  Account
                </p>
                {loginError && (
                  <small className="form-text text-danger">{loginError}</small>
                )}
              </div>
              <Form.Group>
                <Form.Control
                  type="email"
                  required
                  placeholder="Email Address"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  minLength="3"
                />
              </Form.Group>

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
                <Button className="signinBtn" type="submit">
                  Login
                </Button>
              )}

              {/* <div className="d-flex flex-column text-center">
              <FacebookLogin
                appId={REACT_APP_FB}
                fields="name,email,picture"
                callback={loginWithFacebook}
                icon="fa-facebook"
                onFailure={(err) => {
                  console.log("FB LOGIN ERROR:", err);
                }}
                containerStyle={{
                  textAlign: "center",
                  backgroundColor: "#3b5998",
                  borderColor: "#3b5998",
                  flex: 1,
                  display: "flex",
                  color: "#fff",
                  cursor: "pointer",
                  marginBottom: "3px",
                }}
                buttonStyle={{
                  flex: 1,
                  textTransform: "none",
                  padding: "12px",
                  background: "none",
                  border: "none",
                }}
              />
            </div>
 */}

              {/* <GoogleLogin
            className="ggLoginBtn"
              clientId={REACT_APP_GG}
              buttonText="Login with Google"
              onSuccess={loginWithGoogle}
              onFailure={loginWithGoogle}
              cookiePolicy={'single_host_origin'}
              containerStyle={{
                textAlign: "center",
                backgroundColor: "#3b5998",
                borderColor: "#3b5998",
                flex: 1,
                display: "flex",
                color: "#fff",
                cursor: "pointer",
                marginBottom: "3px",
              }}
              buttonStyle={{
                flex: 1,
                textTransform: "none",
                padding: "12px",
                background: "none",
                border: "none",
                width: "100%",
                
              }}
            /> */}

              <p style={{ textAlign: "center" }}>
                Don't have an account? <Link to="/register">Register</Link>
              </p>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
>>>>>>> master
  );
};

export default LoginPage;
