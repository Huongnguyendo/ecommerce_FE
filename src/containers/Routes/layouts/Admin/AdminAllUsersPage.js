import React from "react";
import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch} from "react-redux";
import {productActions} from "../../../../redux/actions/product.actions";
import {Card, Badge, Row, Col, Image} from "react-bootstrap";
// import { useSelector, useDispatch } from "react-redux";

const AllUsersPage = () => {
  let dispatch = useDispatch();
  
//   const selectedProducts = useSelector((state) => state.product.products);


  return (
      <div>
        <>All users here</>
      </div>
    );
};

export default AllUsersPage;

