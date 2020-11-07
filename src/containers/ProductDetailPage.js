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
import { Container, Row, Col, Card, Image, Button, Badge } from "react-bootstrap";
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

  if (loading) return <></>

  return (
    <>
      <div className="d-flex justify-content-between">
          {/* <Button onClick={handleGoBackClick}>
            <FontAwesomeIcon icon="chevron-left" size="1x" /> Back
          </Button> */}
          {console.log("current user ne: ", currentUser)}
          {console.log("productDetail?.seller?._id: ", productDetail?.seller?._id)}
          {currentUser && currentUser?._id === productDetail?.seller?._id ? (
            <Link to={`/seller/products/edit/${productDetail?._id}`}>
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
          <div
            style={{display: "flex",justifyContent: "center",alignItems: "center",}}>
            <Row> 
              <Col md="6">
                <Card className="product-card">
                  <Card.Body>
                  <div>
                    {productDetail.image && (
                      <Image src={productDetail.image} style={{ width: "100%" }} />)}
                  </div>
                         
                </Card.Body>
                </Card>
              </Col>
              <Col md="6">
                  <div>
                    <Badge variant="warning">{productDetail.category}</Badge>
                    <Card.Title>{productDetail.name}</Card.Title>
                    <div>
                      <p>Price: <span className="productDetailPrice">${productDetail?.price}</span ></p>
                      Status:{' '}<Badge variant="primary">{productDetail?.inStockNum > 0 ? 'In Stock' : 'Unavailable.'}</Badge>
                      <p className="mt-3">
                        Quantity:{' '}
                        <select value={quantity} onChange={(e) => {setQuantity(e.target.value);}}>
                          {[...Array(productDetail?.inStockNum).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>))}
                        </select>
                      </p>

                      <div>
                          <p style={{display: "flex",alignItems: "center",}}> 
                          Seller:
                            <Image
                              src={ productDetail && productDetail.seller &&
                                productDetail.seller.avatarUrl ? `${productDetail.seller.avatarUrl}`
                                : "../images/defaultavapic.png"}
                              style={{width: "30px",height: "30px",marginLeft: "10px", marginRight: "10px", marginTop: "5px", marginBottom: "5px" }} roundedCircle/>{" "}
                            <div style={{ width: "fit-content", display: "flex" }}>
                              {productDetail?.seller?.name} 
                              
                            </div>
                          </p>
                      </div>
                      {/* <Markdown source={productDetail.description} /> */}

                      {productDetail?.inStockNum > 0 && (
                          <Button variant="success" onClick={handleAddToCart}
                            className="button primary">
                            Add to Cart
                      </Button>)}
                    </div>
                  </div>
              </Col>
            </Row>       
          </div>        
        )}

<div>
  <ul className="nav nav-tabs" id="myTab" role="tablist">
    <li className="nav-item">
      <a className="nav-link active" id="info-tab" data-toggle="tab" href="#info" role="tab" aria-controls="home" aria-selected="true">Description</a>
    </li>
    <li className="nav-item">
      <a className="nav-link" id="review-tab" data-toggle="tab" href="#review" role="tab" aria-controls="profile" aria-selected="false">Reviews</a>
    </li>
  </ul>
  <div className="tab-content" id="myTabContent">
    <div className="tab-pane fade show active" id="info" role="tabpanel" aria-labelledby="home-tab">
      <div className="description">
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-12">
            <p>
              {productDetail?.description}            
            </p>
          </div>
        </div>
      </div>
    </div>
    <div className="tab-pane fade" id="review" role="tabpanel" aria-labelledby="profile-tab">
      <ReviewList reviews={productDetail?.reviews} loading={submitLoading}/>
    </div>
  </div>
</div>


            
          {isAuthenticated && (
              <ReviewForm
              style={{marginLeft: "50px", marginTop: "20px" }}
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
