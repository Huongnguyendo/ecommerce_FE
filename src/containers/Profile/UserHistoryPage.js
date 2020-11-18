import React, {useEffect} from "react";
import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch} from "react-redux";
// import {productActions} from "../../../../redux/actions/product.actions";
import {userActions} from "../../redux/actions/user.actions";
import {Card, Badge, Row, Col, Image} from "react-bootstrap";
import moment from "moment";
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
          {loading ? <h3 style={{textAlign: "center"}}>Loading ... </h3> : buyingHistory?.length <= 0 ? <h1 style={{textAlign: "center"}}>No Buying History</h1>
          :
 

    <div>
      <h3 style={{textAlign: "center", margin: "20px", backgroundColor: "#f3f3f3", padding: "10px"}}>My Order History</h3>
      <div className="table-wrapper">
      
        <table className="seller-table">
            <thead>
              <tr>
                {/* <td>Image</td> */}
                <td>Order ID</td>
                <td>Product</td>
                <td>Item price</td>
                <td>Quantity</td>
                <td>Total</td>
                <td>Purchase Date</td>
              </tr>
            </thead>
          <tbody>
              {buyingHistory?.map((item) => (
                <tr>
                   <td>{item._id}</td>
                   <td> {item.cartItems.map(innerItem =>  <div style={{border: "none"}}>{innerItem.product.brand} - {innerItem.product.name}</div>)}</td>
                   <td> {item.cartItems.map(innerItem =>  <div style={{border: "none"}}>${innerItem.currentPrice}</div>)}</td>
                   <td> {item.cartItems.map(innerItem =>  <div style={{border: "none"}}>{innerItem.quantity}</div>)}</td>
                   <td> {item.cartItems.map(innerItem =>  <div style={{border: "none"}}>${innerItem.currentPrice * innerItem.quantity}</div>)}</td>
                   <td className="no-padding"> {item.cartItems.map(innerItem =>  <div style={{border: "none"}}> {moment(item.createdAt).format("DD/MM/YYYY")}</div>)}</td>
               </tr>
                  )
                )
              }
          </tbody>
        </table>
      </div>
    </div>

          }
      </div>
    )}


export default UserHistory;

