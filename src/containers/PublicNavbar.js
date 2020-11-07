import React, { useEffect, useState } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from "../images/shopping-logo.jpg";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "redux/actions";
import { productActions, categoryActions } from "redux/actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {Form, FormControl, Button} from "react-bootstrap";
import ".././App.css";

const PublicNavbar = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const loading = useSelector((state) => state.auth.loading);

  let keyword = "";

  const handleLogout = () => {
    dispatch(authActions.logout());
  };

  const currentUser = useSelector((state) => state.auth.user);
  const isSeller = (currentUser && currentUser.role === "Seller");
  const isAdmin = (currentUser && currentUser.role === "Admin");


  const authLinks = (
    <Nav>
        <Nav.Link as={Link} to="/user/profile">
        <FontAwesomeIcon icon="user" size="sm" /> Profile
      </Nav.Link>
      
      <Nav.Link as={Link} to="/cart">
              Cart
      </Nav.Link>

      {/* <Nav.Link as={Link} to="/cart/checkout">
              Checkout
      </Nav.Link> */}

      <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
    </Nav>
  );

  const sellerLinks = (
    <Nav>
        <Nav.Link as={Link} to="/seller/dashboard">
        <FontAwesomeIcon icon="user" size="sm" /> Seller
      </Nav.Link>
      
      <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
    </Nav>
  );

  const adminLinks = (
    <Nav>
        <Nav.Link as={Link} to="/admin/dashboard">
        <FontAwesomeIcon icon="user" size="sm" /> Admin
      </Nav.Link>
      
      <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
    </Nav>
  )

  const publicLinks = (
    <Nav>
      <Nav.Link as={Link} to="/register">
        Register
      </Nav.Link>
      <Nav.Link as={Link} to="/login">
        Login
      </Nav.Link>
    </Nav>
  );

  return (
    <div expand="sm" className="container header-with-search">

      <header id="aa-header" className="mb-5">
        <div className="aa-header-top">
          <div className="container">
            
                <div className="aa-header-top-area">

                  <div className="aa-header-top-left">
                    <div className="aa-language">
                        <a className="btn dropdown-toggle" href="#" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                          ENGLISH
                        </a>
                    </div>                    
                  </div>
                
                  <div className="aa-header-top-right">
                    <div className="aa-head-top-nav-right">
                      
                      <Navbar id="basic-navbar-nav">
                          <Nav className="ml-auto"></Nav>
                          {!loading && 
                          <>{isAdmin? adminLinks : isSeller ? sellerLinks : isAuthenticated ? 
                          authLinks : publicLinks}</>}
                      </Navbar>
                      <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    </div>
                  </div>
                </div>  
          </div>
        </div>


        <div className="aa-header-bottom">
          <div className="container">
            
                <div className="aa-header-bottom-area">
                  <div className="aa-logo">
                    <Link to="/" style={{textDecoration:"none"}}>
                      <span className="fa fa-shopping-cart" /><span className="ml-2 shopName">eShop</span>
                      <p>Your Everything Store</p>
                    </Link>
                  </div>
                  
                  
                  <Form inline 
                    onSubmit={(event) => {
                      event.preventDefault();
                      // console.log("keyword", keyword);
                      dispatch(productActions.searchProductsByKeyword(keyword));}}>
                      <FormControl
                        type="text" placeholder="Search a product" 
                        onChange={(event) => {keyword = event.target.value;}}/>
                      <Button variant="dark" type="submit">Search</Button>
                  </Form>
        
                </div>
              
          </div>
        </div>
      </header>
      
    {/* <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto"></Nav>
        {!loading && 
        <>{isAdmin? adminLinks : isSeller ? sellerLinks : isAuthenticated ? 
        authLinks : publicLinks}</>}
    </Navbar.Collapse> */}
      {/* <Navbar.Toggle aria-controls="basic-navbar-nav" /> */}
      
    </div>
  );
};

export default PublicNavbar;
