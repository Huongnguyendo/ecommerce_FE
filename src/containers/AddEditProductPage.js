import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  ButtonGroup,
} from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import { productActions } from "../redux/actions";
// import { routeActions } from "redux/actions/route.actions";


const AddEditProductPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    images: ["http://placeimg.com/400/300", "http://placeimg.com/400/300"],
  });
  const loading = useSelector((state) => state.product.loading);
  const dispatch = useDispatch();
  const history = useHistory();
  const params = useParams();
  const selectedProduct = useSelector((state) => state.product.selectedProduct);
  const redirectTo = useSelector((state) => state.route.redirectTo);
  const addOrEdit = params.id ? "Edit" : "Add";
  const productId = params.id;

  useEffect(() => {
    if (productId) {
      if (!selectedProduct) {
        dispatch(productActions.getSingleProduct(productId));
      }
      setFormData((formData) => ({
        ...formData,
        title: selectedProduct.title,
        content: selectedProduct.content,
        images: selectedProduct.images,
      }));
    }
  }, [productId, , dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { title, content, images } = formData;
    if (addOrEdit === "Add") {
      dispatch(productActions.createNewProduct(title, content, images));
    } else if (addOrEdit === "Edit") {
      dispatch(
        productActions.updateProduct(selectedProduct._id, title, content, images)
      );
    }
  };

  const handleCancel = () => {
    history.goBack();
  };

  const handleDelete = () => {
    dispatch(productActions.deleteProduct(selectedProduct._id, '/'));
  };

  useEffect(() => {
    if (redirectTo) {
      if (redirectTo === "__GO_BACK__") {
        history.goBack();
        // dispatch(routeActions.removeRedirectTo());
      } else {
        history.push(redirectTo);
        // dispatch(routeActions.removeRedirectTo());
      }
    }
  }, [redirectTo, dispatch, history]);

  return (
    <Container>
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <Form onSubmit={handleSubmit}>
            <div className="text-center mb-3">
              <h1 className="text-primary">{addOrEdit} product</h1>
              <p className="lead">
                <i className="fas fa-user" />
              </p>
            </div>
            <Form.Group>
              <Form.Control
                type="text"
                required
                placeholder="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Control
                as="textarea"
                rows="10"
                placeholder="Content"
                name="content"
                value={formData.content}
                onChange={handleChange}
              />
            </Form.Group>

            <ButtonGroup className="d-flex mb-3">
              {loading ? (
                <Button
                  className="mr-3"
                  variant="primary"
                  type="button"
                  disabled
                >
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Submitting...
                </Button>
              ) : (
                <Button className="mr-3" type="submit" variant="primary">
                  Submit
                </Button>
              )}
              <Button variant="light" onClick={handleCancel} disabled={loading}>
                Cancel
              </Button>
            </ButtonGroup>
            {addOrEdit === "Edit" && (
              <ButtonGroup className="d-flex">
                <Button
                  variant="danger"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  Delete product
                </Button>
              </ButtonGroup>
            )}
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default AddEditProductPage;