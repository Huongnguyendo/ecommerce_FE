import React from "react";
import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch} from "react-redux";
import {productActions} from "../../../../redux/actions/product.actions";
import {Card, Badge, Row, Col, Image} from "react-bootstrap";
// import { useSelector, useDispatch } from "react-redux";

const SellerProductPage = () => {
  let dispatch = useDispatch();
  
  const seller = useSelector((state) => state.auth.user);

  console.log("hihi", seller);

  // new useEffect and action to get selling history


  return (
      <div>
          
          {seller.sellingHistory.length <= 0 ? <h1>No Selling History</h1>
          :
          <div>
          </div>}
      </div>
    );
};

export default SellerProductPage;

