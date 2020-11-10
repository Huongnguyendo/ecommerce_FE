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
                                    <div className="innerHistoryProduct">
                                        <img src={innerItem.product.image} />
                                        <p>{innerItem.product.name}</p>
                                        <p>{innerItem.product.price}</p>
                                        <p>{innerItem.quantity}</p>
                                    </div>
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

