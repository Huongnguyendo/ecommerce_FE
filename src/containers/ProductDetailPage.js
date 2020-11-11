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
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
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

  let [averageRating, setAverageRating] = useState(0);

  console.log("averageRating ne: ", averageRating);

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
  
    <div className="productDetailCom">
        {/* <div className="d-flex justify-content-between">
          {console.log("current user ne: ", currentUser)}
          {console.log("productDetail?.seller?._id: ", productDetail?.seller?._id)}
        </div> */}

        {loading ? (
        <div className="text-center">
          <ClipLoader color="#f86c6b" size={150} loading={loading} />
        </div>
      ) : (
      <>
        {productDetail && (
          <div
            style={{display: "flex",justifyContent: "center",alignItems: "center",width: "100%"}}>
            <div style={{display: "flex",}}> 
                <div className="product-card">
                    {productDetail.image && (
                      <img src={productDetail.image} className="productDetailImg image-zoom" 
                      style={{ width: "100%", borderRadius: "15px" }} 
                        data-zoom={{ img_url: '1024x1024', scale: 2 }}
                      />)}
                      {currentUser && currentUser?._id === productDetail?.seller?._id ? (
                        <Link to={`/seller/products/edit/${productDetail?._id}`}>
                          <Button variant="primary sellerEditBtn" className="mt-3">
                            Edit product
                          </Button>
                        </Link>
                      ) : (
                        <></>
                      )}
                         
                </div>
              <div>
                  <div >
                    <div className="d-flex">
                      <Badge variant="warning">{productDetail.category}</Badge>
                      <span className="productDetailName ml-2">{productDetail.name}</span>
                    </div>
                    <div className="d-flex productInfoRow">
                      <span><i class="fa fa-star" style={{color: "orange"}}></i> {averageRating}</span>
                      <span>{productDetail?.reviews.length} reviews</span>
                      <span>{Math.round(Math.random()*10000)} bought</span>
                    </div>
                    <div>
                      {/* <div class="is-divider"></div> */}
                      <p><span className="productDetailPrice">${productDetail?.price}</span ></p>
                      {/* <p>{LocalShippingIcon} Free shipping</p> */}
                      <Badge variant="dark">{productDetail?.inStockNum > 0 ? 'In Stock' : 'Unavailable.'}</Badge>
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

                      <p style={{marginTop: "30px"}}>
                        {productDetail?.description}            
                      </p>


                      {productDetail?.inStockNum > 0 && (
                          <Button variant="success" onClick={handleAddToCart}
                            className="button primary mr-3">
                            Add to Cart
                          </Button>)}
                          <Link to="/">
                            <Button>
                              Continue Shopping
                            </Button>
                          </Link>

                          <div className="productInfoLower d-flex justify-content-between mt-3">
                            <span><i class="fa fa-money-bill"></i> 7 days cash back</span>
                            <span><i class="fa fa-check-circle"></i> 100% auth</span>
                            <span><i class="fa fa-shipping-fast"></i> Free shipping</span>
                          </div>
                    </div>
                  </div>
              </div>
            </div>       
          </div>        
        )}

    {/* <div style={{marginTop: "50px", marginLeft: "50px", marginTop: "20px"}}>
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
                <p style={{marginTop: "30px"}}>
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

     */}
    <div className="productDetailRVlist">
        <ReviewList setAverageRating={setAverageRating} reviews={productDetail?.reviews} loading={submitLoading}/>
    </div>

    <div className="reviewFormInPD">
          {isAuthenticated && (
              <ReviewForm
                style={{marginLeft: "50px", marginTop: "20px" }}
                  reviewText={reviewText}
                  handleInputChange={handleInputChange}
                  handleSubmitReview={handleSubmitReview}
                  loading={submitLoading}
              />
          )}
    </div>
      
      </>
      )}
    </div>
  );
};

export default ProductDetailPage;
