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
    name: "",
    description: "",
    image: "http://placeimg.com/400/300",
    brand: "",
    price: 0,
    category: "",
    inStockNum: 0
  });
  const loading = useSelector((state) => state.product.loading);
  const dispatch = useDispatch();
  const history = useHistory();
  const params = useParams();
  const selectedProduct = useSelector((state) => state.product.selectedProduct);
  const redirectTo = useSelector((state) => state.route.redirectTo);
  const addOrEdit = params.id ? "Edit" : "Add";
  const productId = params.id;

  const error = useSelector((state) => state.product.error);

  console.log("hihahohe: ", error);
  console.log("add or edit ne: ", addOrEdit);
  console.log("selectedProduct ne: ", selectedProduct)

  useEffect(() => {
    console.log("o day ne");
    if (productId) {
      if (!selectedProduct) {
        // dispatch(productActions.getSingleProduct(productId));
        dispatch(productActions.getProductDetailForSeller(productId));
      } else {
        setFormData((formData) => ({
          ...formData,
          name: selectedProduct?.name,
          description: selectedProduct?.description,
          image: selectedProduct?.image,
          brand: selectedProduct?.brand, 
          price: selectedProduct?.price, 
          category: selectedProduct?.category, 
          inStockNum: selectedProduct?.inStockNum
        }));
      }
    }
  }, [productId, selectedProduct, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, description, image, brand, price, category, inStockNum } = formData;
    if (addOrEdit === "Add") {
      dispatch(productActions.createNewProduct(name, description, image, brand, price, category, inStockNum));
    } else if (addOrEdit === "Edit") {
      dispatch(
        productActions.updateProduct(selectedProduct?._id, name, description, image, brand, price, category, inStockNum)
      );
    }
  };

  const handleCancel = () => {
    history.goBack();
  };

  const handleDelete = () => {
    dispatch(productActions.deleteProduct(selectedProduct._id, '/'));
  };

  // useEffect(() => {dispatch(productActions.getProductDetailForSeller(productId))},[])

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
    <div>
      <Row className="d-flex justify-content-center align-items-center">
        {(error?.data?.error === "Unauthorized action") ? <h1>Not allowed</h1> :
        <Col md={{ span: 6, offset: 3 }}>
          <Form onSubmit={handleSubmit}>
            <div className="text-center mb-3">
              <h1 className="text-primary">{addOrEdit} product</h1>
              
            </div>
            <Form.Group>
              <Form.Control
                type="text"
                required
                placeholder="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Control
                as="textarea"
                rows="10"
                placeholder="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group>
              <Form.Control
                as="textarea"
                placeholder="brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group>
              <Form.Control
                as="textarea"
                placeholder="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              />
            </Form.Group>

              <input placeholder="price" type="number" id="price" name="price" value={formData.price} onChange={handleChange}
              style={{height:"40px", width:"100%", marginBottom: "20px"}}
              />
              <input placeholder="inStockNum" type="number" id="inStockNum" name="inStockNum"  value={formData.inStockNum} onChange={handleChange}
              style={{height:"40px", width:"100%", marginBottom: "20px"}}
              />

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
        </Col>}
      </Row>
    </div>
  );
};

export default AddEditProductPage;