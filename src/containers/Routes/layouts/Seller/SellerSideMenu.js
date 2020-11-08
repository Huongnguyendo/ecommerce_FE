import React from "react";
import { Nav, Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch} from "react-redux";
import {productActions} from "../../../../redux/actions/product.actions";
// import { useSelector, useDispatch } from "react-redux";

const SideMenu = () => {
  let dispatch = useDispatch();
  // let seller = useSelector((state) => state.auth.isAuthenticated);

  const getAllProductsForSeller = () => {
    dispatch(productActions.getAllProductsForSeller());
  }



  return (
    <div style={{textAlign: "center" }}>
      <h1>Seller Dashboard</h1>
      <div className="d-flex justify-content-center">
        <Nav.Item>
          <Nav.Link
            as={NavLink}
            to="/seller/profile"
            activeClassName="active"
            strict={true}
          >
            Profile
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            as={NavLink}
            to="/seller/products"
            activeClassName="active"
            strict={true}
            onClick={getAllProductsForSeller}
          >
            Products
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            as={NavLink}
            to="/seller/history"
            activeClassName="active"
            strict={true}
          >
            History
          </Nav.Link>
        </Nav.Item>
      </div>
    </div>
  );
};

export default SideMenu;
