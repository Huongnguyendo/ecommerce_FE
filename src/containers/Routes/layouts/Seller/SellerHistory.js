import React, {useEffect} from "react";
import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch} from "react-redux";
import {productActions} from "../../../../redux/actions/product.actions";
import {Card, Badge, Row, Col, Image} from "react-bootstrap";
// import { useSelector, useDispatch } from "react-redux";

const SellerProductPage = () => {
  let dispatch = useDispatch();
  
  const seller = useSelector((state) => state.auth.user);
  const sellingHistory = useSelector((state) => state.product.historyToRender)

  console.log("sellingHistory ", sellingHistory);

  // new useEffect and action to get selling history
  useEffect(() => {
    
      dispatch(productActions.getHistoryForSeller());
    
  }, [dispatch]);

  return (
      <div>
          
          {sellingHistory.length <= 0 ? <h1>No Selling History</h1>
          :
          <div>
            {sellingHistory.map((item) => (
              <div className="d-flex justify-content-center">
                <div className="historyProduct">
                  <Image src={item.product.image} />
                  <p>Category: {item.product.category}</p>
                  <p>Brand: {item.product.brand}</p>
                  <p>Name: {item.product.name}</p>
                  <p>Price: ${item.product.price}</p>
                </div>
                <div className="historyBuyers">
                  {item.buyers.map(buyer => (
                    <div>
                      <Image src={buyer.avatarUrl} style={{width: "40px"}}/>
                      <p>Name: {buyer.name}</p>
                      <p>Time bought: {buyer.createdAt}</p>
                    </div>
                  ))}
                  
                </div>
              </div>
          ))}
          </div>}
        
      </div>
    );
};

export default SellerProductPage;

