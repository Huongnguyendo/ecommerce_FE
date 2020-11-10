import React, {useEffect} from "react";
import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch} from "react-redux";
// import {productActions} from "../../../../redux/actions/product.actions";
import {userActions} from "../../redux/actions/user.actions";
import {Card, Badge, Row, Col, Image} from "react-bootstrap";
import Moment from "react-moment";
// import { useSelector, useDispatch } from "react-redux";

const UserHistory = () => {
  let dispatch = useDispatch();
  
  const user = useSelector((state) => state.auth.user);
  const buyingHistory = useSelector((state) => state.user.buyingHistory)
  let loading = useSelector((state) => state.user.loading);

  console.log("buyingHistory ", buyingHistory);

  useEffect(() => {
    
      dispatch(userActions.getHistoryForUser());
    
  }, [dispatch]);

  return (
      <div className="buyingHistoryPage">
          {loading ? <h3>Loading ... </h3> : buyingHistory?.length <= 0 ? <h1>No Buying History</h1>
          :
          <div>
              
                    {buyingHistory?.map((item) => (
                    <div className="historyProductRow d-flex justify-content-center">
                        <div className="historyProduct" style={{textAlign: "center"}}>
                            {
                                item.cartItems.map(innerItem => (
                                    // <div className="innerHistoryProduct">
                                    //     <img src={innerItem.product.image} />
                                    //     <p>{innerItem.product.name}</p>
                                    //     <p>{innerItem.product.price}</p>
                                    //     <p>{innerItem.quantity}</p>
                                    // </div>
                                    <section>
                                      <div className="row">
                                        <div className="col-lg-8">
                                          <div className="mb-3">
                                            <div className="pt-4 wish-list">
                                              <div className="row mb-4">
                                                <div className="col-md-5 col-lg-3 col-xl-3">
                                                  <div className="view zoom overlay z-depth-1 rounded mb-3 mb-md-0">
                                                    <img className="img-fluid w-100" src={innerItem.product.image} alt="Sample" />
                                                  </div>
                                                </div>
                                                <div className="col-md-7 col-lg-9 col-xl-9">
                                                  <div>
                                                    <div className="d-flex justify-content-between">
                                                      <div>
                                                        <h5>{innerItem.product.name}</h5>
                                                        
                                                      </div>
                                                      <div>
                                                        <div className=" mb-0 w-100">
                                                          <p className="quantity" >{innerItem.quantity}</p>
                                                        </div>
                                                        <div className="mb-0 w-100">
                                                          <p>Bought: {item.createdAt}</p>
                                                        </div>
                                                      </div>
                                                    </div>
                                                    <div className="d-flex justify-content-between align-items-center">
                                                      
                                                      <p className="mb-0">
                                                        <span><strong id="summary">${innerItem.product.price}</strong></span>
                                                        </p>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                              <hr className="mb-4" />
                                              
                                              
                                            </div>
                                          </div>
                                          
                                          
                                        </div>
                                        <div className="col-lg-4">
                                          <div className="mb-3">
                                            <div className="pt-4">
                                              <h5 className="mb-3">Total</h5>
                                              <h5>${innerItem.product.price * innerItem.quantity}</h5>
                                            </div>
                                          </div>
                                          
                                        </div>
                                      </div>
                                    </section>

                                ))
                            }              
                        </div>
                        
                    </div>
                ))}
                {console.log("wiwiwiwi: ", buyingHistory)}
          </div>}
        
          
      </div>
    );
};

export default UserHistory;

