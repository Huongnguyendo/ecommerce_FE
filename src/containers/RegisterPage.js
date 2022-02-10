import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { authActions, routeActions } from "../redux/actions";
// import { routeActions } from "redux/actions/route.actions";
import Select from "react-select";
import { FormGroup } from "@material-ui/core";
import PublicNavbar from "./PublicNavbar";
import { ToastContainer, toast } from "react-toastify";

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

  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);
  const redirectTo = useSelector((state) => state.route.redirectTo);
  const history = useHistory();

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
        if (error) console.log(error);
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
  );
};

export default RegisterPage;
