import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory, Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import Moment from "react-moment";
import Markdown from "react-markdown";
import { productActions, cartActions } from "redux/actions";
import ReviewList from "components/ReviewList";
import ReviewForm from "components/ReviewForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container, Row, Col, Card, Image, Button } from "react-bootstrap";
import moment from "moment";

const ProductDetailPage = () => {
  let { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  let productDetail = useSelector((state) => state.product.selectedProduct);
  // console.log("state.product.selectedProduct", productDetail);
  const loading = useSelector((state) => state.product.loading);
  const currentUser = useSelector((state) => state.auth.user);
  const history = useHistory();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const submitLoading = useSelector((state) => state.product.submitLoading);
  const [reviewText, setReviewText] = useState("");

  const getProductDetail = () => {
    dispatch(productActions.getProductDetail(id));
  };

  const handleInputChange = (e) => {
    setReviewText(e.target.value);
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    dispatch(productActions.createReview(id, reviewText));
    setReviewText("");
  };

  
  const handleGoBackClick = (e) => {
    history.goBack();
  };

  const handleAddToCart = () => {
    // history.push('/cart/add/' + id + '?quantity=' + quantity);
    dispatch(cartActions.addToCart(id, quantity));
  };

  useEffect(() => {
    if(id) {
      getProductDetail();
    }
  }, [id]);

  return (
    <>
      <div className="d-flex justify-content-between">
          {/* <Button onClick={handleGoBackClick}>
            <FontAwesomeIcon icon="chevron-left" size="1x" /> Back
          </Button> */}
          {currentUser?._id === productDetail?.seller?._id ? (
            <Link to={`/products/edit/${productDetail?._id}`}>
              <Button variant="primary">
                <FontAwesomeIcon icon="edit" size="1x" /> Edit
              </Button>
            </Link>
          ) : (
            <></>
          )}
        </div>
        {loading ? (
        <div className="text-center">
          <ClipLoader color="#f86c6b" size={150} loading={loading} />
        </div>
      ) : (
      <>
        {productDetail && (
          <Container
            style={{
              minHeight: "80vh",
              // display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* <Col sm={12}> */}
              <Card className="product-card">
                <Card.Body>
                  <Card.Title>{productDetail.name}</Card.Title>
                  <div>
                    {/* <Card.Text>Description: {productDetail.description}</Card.Text>{" "} */}
                    {productDetail.image && (
                      <Image src={productDetail.image} style={{ width: "80%" }} />
                    )}
                  </div>
                </Card.Body>
                <Card.Footer>
                  <small
                    className="text-muted"
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  > Seller: 
                    <Image
                      src={
                        productDetail.seller.avatarUrl === ""
                          ? "../images/defaultavapic.png"
                          : `${productDetail.seller.avatarUrl}`
                      }
                      style={{
                        width: "30px",
                        height: "30px",
                        marginRight: "10px",
                      }}
                      roundedCircle
                    />{" "}
                    <div style={{ width: "fit-content", display: "flex" }}>
                      {productDetail.seller.name} 
                      {/* <br /> wrote{" "}
                      {moment(productDetail.updatedAt).fromNow()} */}
                    </div>
                  </small>
                </Card.Footer>
                <Card>
                  <Card.Body>
                      <i>Product description</i> <Markdown source={productDetail.description} />
                  </Card.Body>
                </Card>
              </Card>
            {/* </Col> */}
            
            
            
            <ReviewList
              reviews={productDetail.reviews}
              loading={submitLoading}
            />


              <ul>
                <li>Price: ${productDetail.price}</li>
                <li>
                  Status:{' '}
                  {productDetail.inStockNum > 0 ? 'In Stock' : 'Unavailable.'}
                </li>
                <li>
                  Quantity:{' '}
                  <select
                    value={quantity}
                    onChange={(e) => {
                      setQuantity(e.target.value);
                    }}
                  >
                    {[...Array(productDetail.inStockNum).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </li>
              </ul>
                  {productDetail.inStockNum > 0 && (
                    <Button
                      variant="success"
                      onClick={handleAddToCart}
                      className="button primary"
                    >
                      Add to Cart
                    </Button>
                  )}
            
          </Container>
        
          
        )}

          {isAuthenticated && (
              <ReviewForm
                reviewText={reviewText}
                handleInputChange={handleInputChange}
                handleSubmitReview={handleSubmitReview}
                loading={submitLoading}
              />
            )}

            
      </>
      )}
    </>
  );
};

export default ProductDetailPage;
