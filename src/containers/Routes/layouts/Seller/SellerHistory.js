import React, {useEffect} from "react";
import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch} from "react-redux";
import {productActions} from "../../../../redux/actions/product.actions";
import {Card, Badge, Row, Col, Image} from "react-bootstrap";
import Moment from "react-moment";
// import { useSelector, useDispatch } from "react-redux";

const SellerProductPage = () => {
  let dispatch = useDispatch();
  
  const seller = useSelector((state) => state.auth.user);
  const sellingHistory = useSelector((state) => state.product.historyToRender)
  let loading = useSelector((state) => state.product.loading);

  console.log("sellingHistory ", sellingHistory);

  // new useEffect and action to get selling history
  useEffect(() => {
    
      dispatch(productActions.getHistoryForSeller());
    
  }, [dispatch]);

  return (
      <div className="sellingHistoryPage">
          {loading ? <h3>Loading ... </h3> : sellingHistory?.length <= 0 ? <h1>No Selling History</h1>
          :
          <div>
            {sellingHistory?.map((item) => (
              <div className="historyProductRow d-flex justify-content-center">
                {/* <div className="historyProduct d-flex" >
                  <Image src={item.product.image} style={{width: "100px", height: "100px"}}/>
                  <div>
                    <p>Category: {item.product.category}</p>
                    <p>Brand: {item.product.brand}</p>
                    <p>Name: {item.product.name}</p>
                    <p>Price: ${item.product.price}</p>
                  </div>
                </div> */}
                <div className="historyBuyers">
                  {console.log("hihoeh")}
                  {item.history?.map(innerItem => (
                    <div >
                        {console.log("innerItem ", innerItem)}
                        <Image src={item.product.image} style={{width: "30px", height: "30px"}}/>
                        <span>{item.product.category}</span>
                        <span>{item.product.brand}</span>
                        <span>{item.product.name}</span>
                        <span>{item.product.price}</span>
                        <Image src={innerItem.buyer?.avatarUrl} style={{width: "20px", height: "20px", marginRight: "10px"}}/>
                        <span>{innerItem.buyer?.name}</span>
                        <span>Time bought: {innerItem.createdAt}</span>
                        <span>Quantity: {innerItem.quantity}</span>
                    </div>
                  ))}
                  
                </div>
                {/* <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th />
                      <th />
                      <th>Product</th>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Buyer</th>
                      <th>Quantity</th>
                      <th>Time bought</th>
                      <th/>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><a href="#"><img src={item.product.image} alt="img" /></a></td>
                      <td>
                        {item.product.name}
                      </td>
                      <td className="cart-price">${item.product.price}</td>
                      <td>{item.quantity}</td>
                      <td className="cart-subtotal">${(item.product.price * item.quantity).toLocaleString()}</td>
                      <Button variant="danger" type="button" className="button mt-1" onClick={() => removeFromCartHandler(item.product)} >
                        Delete
                      </Button>
                    </tr>
                     
                  </tbody>
                </table>
              </div>
  */}
              </div>
          ))}
          </div>}
        
      </div>
    );
};

export default SellerProductPage;

