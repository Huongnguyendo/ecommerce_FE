import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { productActions, cartActions } from "redux/actions";
import ReviewList from "components/ReviewList";
import ReviewForm from "components/ReviewForm";
import { Row, Col, Image, Button, Badge } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";

import user from "../images/defaultavapic.png";

const ProductDetailPage = () => {
  let { id } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();

  // first, get and display product details
  const getProductDetail = () => {
    dispatch(productActions.getProductDetail(id));
  };
  let productDetail = useSelector((state) => state.product.selectedProduct);
  const loading = useSelector((state) => state.product.loading);

  // add to cart function
  const [quantity, setQuantity] = useState(1);

  // add rating
  const [rating, setRating] = useState(5);

  // console.log("rating", rating);

  let currentPrice = productDetail?.price;
  const currentUser = useSelector((state) => state.auth.user);

  const handleAddToCart = () => {
    // history.push('/cart/add/' + id + '?quantity=' + quantity);
    if (!currentUser) {
      toast.error("Login required");
      setTimeout(() => {
        history.push("/login");
      }, 4000);
    } else {
      dispatch(cartActions.addToCart(id, quantity, currentPrice));
    }
  };

  // review writing function
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const submitLoading = useSelector((state) => state.product.submitLoading);
  const [reviewText, setReviewText] = useState("");
  let [averageRating, setAverageRating] = useState(0);

  const handleInputChange = (e) => {
    setReviewText(e.target.value);
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    dispatch(productActions.createReview(id, reviewText, rating));
    setReviewText("");
    setRating(5);
  };

  // const handleGoBackClick = (e) => {
  //   history.goBack();
  // };

  useEffect(() => {
    if (id) {
      getProductDetail();
    }
  }, [id]);

  if (loading) return <></>;

  return (
    <div className="productDetailCom container">
      {loading ? (
        <div className="text-center">
          <ClipLoader color="#f86c6b" size={150} loading={loading} />
        </div>
      ) : (
        <>
          {/* <ToastContainer /> */}
          {productDetail && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Row style={{ display: "flex" }}>
                <Col className="product-card mb-5" md={6} sm={12}>
                  {productDetail.image && (
                    <img
                      src={productDetail.image}
                      className="productDetailImg image-zoom"
                      style={{ width: "90%", borderRadius: "15px" }}
                      data-zoom={{ img_url: "1024x1024", scale: 2 }}
                    />
                  )}
                </Col>
                <Col className="productInfoCard" md={6} sm={12}>
                  <div>
                    <div className="d-flex mb-2">
                      <Badge className="productDetailBadge" variant="warning">
                        {productDetail.category}
                      </Badge>
                      <span className="productDetailName ml-2">
                        {productDetail.name}
                      </span>
                    </div>
                    <div className="d-flex productInfoRow">
                      <span>
                        <i
                          className="fa fa-star"
                          style={{ color: "orange" }}
                        ></i>{" "}
                        {parseInt(averageRating) ? averageRating : 0}
                      </span>
                      <span className="reviewDevider">
                        {productDetail?.reviews?.length > 1
                          ? productDetail?.reviews?.length + " reviews"
                          : productDetail?.reviews?.length + " review"}
                      </span>
                    </div>

                    <table className="productDetailTable">
                      <tbody>
                        <tr>
                          <td className="pdInfoTitle">Price</td>
                          <td>
                            <span className="productDetailPrice">
                              ${productDetail?.price}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="pdInfoTitle">Availability</td>
                          <td>
                            {productDetail?.inStockNum > 0 ? (
                              <Badge variant="success">In stock</Badge>
                            ) : (
                              <Badge variant="dark">Unavailable</Badge>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className="pdInfoTitle">Quantity</td>
                          <td className="pdInfoTitle">
                            <select
                              value={quantity}
                              onChange={(e) => {
                                setQuantity(e.target.value);
                              }}
                              style={{ width: "55px" }}
                            >
                              {productDetail?.inStockNum >= 5
                                ? [...Array(5).keys()].map((x) => (
                                    <option key={x + 1} value={x + 1}>
                                      {x + 1}
                                    </option>
                                  ))
                                : productDetail?.inStockNum > 0 &&
                                  [
                                    ...Array(productDetail?.inStockNum).keys(),
                                  ].map((x) => (
                                    <option key={x + 1} value={x + 1}>
                                      {x + 1}
                                    </option>
                                  ))}
                              {/* {productDetail?.inStockNum > 0 &&
                            [...Array(productDetail?.inStockNum).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )} */}
                            </select>
                          </td>
                        </tr>
                        <tr>
                          <td className="pdInfoTitle">Merchant</td>
                          <td>
                            <p
                              style={{
                                marginBottom: "0",
                              }}
                            >
                              <Image
                                src={
                                  //   : "../images/defaultavapic.png"} //   productDetail.seller.avatarUrl ? `${productDetail.seller.avatarUrl}` // { productDetail && productDetail.seller &&
                                  user
                                }
                                style={{
                                  width: "30px",
                                  height: "30px",
                                  marginLeft: "10px",
                                  marginRight: "10px",
                                  marginTop: "5px",
                                  marginBottom: "5px",
                                }}
                                roundedCircle
                              />{" "}
                              <span
                                style={{
                                  width: "fit-content",
                                  // display: "flex",
                                }}
                              >
                                {productDetail?.seller?.name}
                              </span>
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td className="pdInfoTitle">Description</td>
                          <td>
                            <span>{productDetail?.description}</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    {productDetail?.inStockNum > 0 && (
                      <Button
                        variant="danger"
                        onClick={handleAddToCart}
                        className="button primary mt-3"
                        style={{ width: "100%" }}
                      >
                        <i className="fa fa-shopping-cart"></i>
                        <span style={{ marginLeft: "10px" }}>Add to Cart</span>
                      </Button>
                    )}
                    {/* <Link to="/">
                        <Button>Continue Shopping</Button>
                      </Link> */}

                    <div className="productInfoLower d-flex justify-content-between mt-3">
                      <span>
                        <i className="fa fa-money-bill"></i> 7 days cash back
                      </span>
                      <span>
                        <i className="fa fa-check-circle"></i> 100% authentic
                      </span>
                      <span>
                        <i className="fa fa-shipping-fast"></i> Free shipping
                      </span>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          )}

          <div className="productDetailRVlist">
            <ReviewList
              setAverageRating={setAverageRating}
              reviews={productDetail?.reviews}
              // loading={submitLoading}
            />
          </div>

          <div className="reviewFormInPD">
            {isAuthenticated && (
              <div className="reviewGroupForm" style={{ marginTop: "20px" }}>
                <ReviewForm
                  reviewText={reviewText}
                  handleInputChange={handleInputChange}
                  handleSubmitReview={handleSubmitReview}
                  loading={submitLoading}
                  rating={rating}
                  setRating={setRating}
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductDetailPage;
