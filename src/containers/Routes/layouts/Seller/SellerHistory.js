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
                <div className="historyProduct" style={{textAlign: "center"}}>
                  <Image src={item.product.image} />
                  <p>Category: {item.product.category}</p>
                  <p>Brand: {item.product.brand}</p>
                  <p>Name: {item.product.name}</p>
                  <p>Price: ${item.product.price}</p>
                </div>
                <div className="historyBuyers">
                  {console.log("hihoeh")}
                  {item.history?.map(innerItem => (
                    <div className="d-flex mb-2 ml-5" style={{justifyContent: "center", alignItems: "center",}}>
                      
                      <Image src={innerItem.buyer?.avatarUrl} style={{width: "30px", height: "30px", marginRight: "10px"}}/>
                      <div>
                        <p>{innerItem.buyer?.name}</p>
                        <p>Time bought: {innerItem.createdAt}</p>
                        <p>Quantity: {innerItem.quantity}</p>
                      </div>
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

