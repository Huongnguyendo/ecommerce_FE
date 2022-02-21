import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Row, Col, ButtonGroup } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import { productActions, routeActions } from "../redux/actions";
// import { routeActions } from "redux/actions/route.actions";
import { Button } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";

const AddEditProductPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    brand: "",
    price: 0,
    category: "",
    inStockNum: 0,
  });

  const loading = useSelector((state) => state.product.loading);
  const dispatch = useDispatch();
  const [editable, setEditable] = useState(true);

  const history = useHistory();
  const params = useParams();
  const selectedProduct = useSelector((state) => state.product.selectedProduct);
  const redirectTo = useSelector((state) => state.route.redirectTo);
  const addOrEdit = params.id ? "Edit" : "Add";
  const productId = params.id;

  const error = useSelector((state) => state.product.error);

  useEffect(() => {
    if (productId) {
      if (productId !== selectedProduct?._id) {
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
          inStockNum: selectedProduct?.inStockNum,
        }));
      }
    }
  }, [productId, selectedProduct, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, description, image, brand, price, category, inStockNum } =
      formData;

    if (addOrEdit === "Add") {
      if (!name || !description || !image || !brand || !price || !inStockNum) {
        toast.error("Please fill in all fields!");
        return;
      }
      if (category !== "") {
        dispatch(
          productActions.createNewProduct(
            name,
            description,
            image,
            brand,
            price,
            category,
            inStockNum
          )
        );
      } else {
        dispatch(
          productActions.createNewProduct(
            name,
            description,
            image,
            brand,
            price,
            "Fashion",
            inStockNum
          )
        );
      }
      history.push(`/seller/products`);
    } else if (addOrEdit === "Edit") {
      dispatch(
        productActions.updateProduct(
          selectedProduct?._id,
          name,
          description,
          image,
          brand,
          price,
          category,
          inStockNum
        )
      );
    }
  };

  const handleCancel = () => {
    history.goBack();
  };

  const handleDelete = () => {
    dispatch(productActions.deleteProduct(selectedProduct._id, "/"));
  };

  // useEffect(() => {dispatch(productActions.getProductDetailForSeller(productId))},[])

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
  }, [redirectTo, dispatch, history]);

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
            image: result.info.secure_url,
          });
        }
      }
    );
  };

  return (
    <div>
      <ToastContainer />
      <Row
        className="d-flex align-items-center"
        style={{ marginRight: "0", marginLeft: "0", justifyContent: "center" }}
      >
        {error?.data?.error === "Unauthorized action" ? (
          <h1>Not allowed</h1>
        ) : (
          <Col md={{ span: 6 }}>
            <Form onSubmit={handleSubmit}>
              <div className="text-center mb-3">
                <h1
                  className="text-primary"
                  style={{
                    marginTop: "30px",
                    marginBottom: "30px",
                    color: "#0089d1",
                  }}
                >
                  {addOrEdit} product
                </h1>
              </div>
              <Button
                variant="contained"
                color="info"
                className="btn-block w-100 mb-3"
                onClick={uploadWidget}
                disabled={!editable}
              >
                Upload image
              </Button>
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
                {/* <Form.Control
                as="textarea"
                placeholder="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              /> */}
                Category
                <select
                  style={{ width: "100%" }}
                  name="category"
                  placeholder="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="Fashion">Fashion</option>
                  <option value="Phones and Accessories">
                    Phones and Accessories
                  </option>
                  <option value="Electronic device">Electronic device</option>
                  <option value="Household goods">Household goods</option>
                  <option value="Home and Life">Home and Life</option>
                  <option value="Health and Life">Health and Life</option>
                  <option value="Fashion Accessories">
                    Fashion Accessories
                  </option>
                  <option value="Books">Books</option>
                </select>
              </Form.Group>
              Price
              <input
                placeholder="price"
                type="number"
                id="price"
                className="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                style={{
                  height: "40px",
                  width: "100%",
                  marginBottom: "20px",
                  border: "1px solid #ced4da",
                  textIndent: "10px",
                }}
              />
              Stock
              <input
                placeholder="inStockNum"
                type="number"
                id="inStockNum"
                name="inStockNum"
                value={formData.inStockNum}
                onChange={handleChange}
                style={{
                  height: "40px",
                  width: "100%",
                  marginBottom: "20px",
                  border: "1px solid #ced4da",
                  textIndent: "10px",
                }}
              />
              <div className="d-flex mb-3 editDeleteProduct">
                <ButtonGroup className="d-flex mb-3">
                  {loading ? (
                    <Button
                      className="mr-3"
                      variant="contained"
                      color="success"
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
                    <Button
                      className="mr-3"
                      type="submit"
                      variant="contained"
                      color="success"
                    >
                      Submit
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </ButtonGroup>
                {addOrEdit === "Edit" && (
                  <ButtonGroup className="d-flex mb-3">
                    <Button
                      variant="contained"
                      color="error"
                      onClick={handleDelete}
                      disabled={loading}
                      width="100%"
                    >
                      Delete product
                    </Button>
                  </ButtonGroup>
                )}
              </div>
            </Form>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default AddEditProductPage;
