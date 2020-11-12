import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Redirect, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "redux/actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { REACT_APP_FB, REACT_APP_GG } from "../config/constants";
import FacebookLogin from "react-facebook-login";
import GoogleLogin from 'react-google-login';
import PublicNavbar from "../containers/PublicNavbar"
import "../App.css";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const loading = useSelector((state) => state.auth.loading);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = formData;
    if (password.length < 3) {
      setErrors({ ...errors, password: "Password must be longer than 3" });
      return;
    }
    dispatch(authActions.loginRequest(email, password));
  };


  // log in with facebook
  // send the token to backend via redux
  const loginWithFacebook = (response) => {
    console.log("fb login: ", response);
    dispatch(authActions.loginFacebookRequest(response.accessToken));
  };

  const loginWithGoogle = (response) => {
    console.log("gg login: ", response);
    dispatch(authActions.loginGoogleRequest(response.accessToken));
  };

  

    if (isAuthenticated) return  <Redirect to="/" />

  
  return (
    <>
    <PublicNavbar />
    <Container>
      {/* {isAuthenticated ? "haha" : "hoho"} */}
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <Form onSubmit={handleSubmit}>
            <div className="text-center mb-3 mt-5">
              <h1 className="text-primary">Log In</h1>
              {/* <p className="lead">
                <FontAwesomeIcon icon="user" size="1x" /> Sign Into Your Account
              </p> */}
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
              {errors.email && (
                <small className="form-text text-danger">{errors.email}</small>
              )}
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
              {errors.password && (
                <small className="form-text text-danger">
                  {errors.password}
                </small>
              )}
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
                ></span>
                Loading...
              </Button>
            ) : (
              <button className="signinBtn" type="submit" >
                Login
              </button>
            )}

            <div className="d-flex flex-column text-center">
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

            <p style={{textAlign: "center"}}>
              Don't have an account? <Link to="/register">Register</Link>
            </p>
          </Form>
        </Col>
      </Row>
    </Container>
    </>
  );
};

export default LoginPage;