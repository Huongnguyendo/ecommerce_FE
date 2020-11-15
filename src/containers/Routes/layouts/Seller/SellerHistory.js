import React, {useEffect} from "react";
import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch} from "react-redux";
import {productActions} from "../../../../redux/actions/product.actions";
import {Card, Badge, Row, Col, Image} from "react-bootstrap";
import moment from "moment";
// import { useSelector, useDispatch } from "react-redux";

const SellerProductPage = () => {
  let dispatch = useDispatch();
  
  const seller = useSelector((state) => state.auth.user);
  const sellingHistory = useSelector((state) => state.product.historyToRender)
  let loading = useSelector((state) => state.product.loading);


  // new useEffect and action to get selling history
  useEffect(() => {
    
      dispatch(productActions.getHistoryForSeller());
    
  }, [dispatch]);

  return (
      <div className="sellingHistoryPage">
          {loading ? <h3>Loading ... </h3> : sellingHistory?.length <= 0 ? <h1 style={{textAlign: "center", marginTop: "30px"}}>No Selling History</h1>
          :
            <div className="table-wrapper">
              <table className="seller-table">
                  <thead>
                    <tr>
                      <td>Image</td>
                      <td>Category</td>
                      <td>Brand</td>
                      <td>Name</td>
                      <td>Price</td>   
                      <td>Buyer</td>   
                      <td>Time Bought</td> 
                      <td>Quantity</td>
                    </tr>
                  </thead>
                <tbody>
                    {sellingHistory?.map((item) => (
                        <tr >
                  
                        <td className="table-pic"><img src={item.product.image} /></td>
                        <td>{item.product.category}</td>
                        <td>{item.product.brand}</td>
                        <td>{item.product.name}</td>
                        <td>${item.product.price}</td>
                            <td className="no-padding">
                                {item.history?.map(innerItem => (
                                      <div>
                                      
                                      {innerItem.buyer?.name}
                                      </div>
                                  ))}
                            </td>
                            <td className="no-padding">
                                  {item.history?.map(innerItem => (
                            <div>
                              
                              {moment(innerItem.purchaseDate).format("DD/MM/YYYY")}
                              </div>
                          ))}
                            </td>
                            <td className="no-padding text-center">
                        {item.history?.map(innerItem => (
                            <div>
                              
                              {innerItem.quantity}
                              </div>
                          ))}
                            </td>
                      
                      </tr>
                        ))
                    }
                </tbody>
              </table>
            </div>
          
          }
        
      </div>
    );
};

export default SellerProductPage;

