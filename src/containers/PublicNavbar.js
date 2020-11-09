import React, { useEffect, useState } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from "../images/online-shopping.png";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "redux/actions";
import { productActions, categoryActions } from "redux/actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {Form, FormControl, Button} from "react-bootstrap";
import Select from 'react-select';
import ".././App.css";

const PublicNavbar = () => {
  const dispatch = useDispatch();
  const [pageNum, setPageNum] = useState(1); 

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const loading = useSelector((state) => state.auth.loading);

  let keyword = "";

  const handleLogout = () => {
    dispatch(authActions.logout());
  };

  const currentUser = useSelector((state) => state.auth.user);
  const isSeller = (currentUser && currentUser.role === "Seller");
  const isAdmin = (currentUser && currentUser.role === "Admin");

  const [category, setCategory] = useState("All");
  const categories = [
    { value: 'All', label: 'All Categories'},
    { value: 'Fashion', label: 'Fashion' },
    { value: 'Phones & Accessories', label: 'Phones & Accessories' },
    { value: 'Electronic device', label: 'Electronic device' },
    { value: 'Household goods', label: 'Household goods' },
    { value: 'Home & Life', label: 'Home & Life' },
    { value: 'Health & Life', label: 'Health & Life' },
    { value: 'Fashion Accessories', label: 'Fashion Accessories' },
    { value: 'Books', label: 'Books' },
  ]

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      borderBottom: '1px dotted pink',
      color: state.isSelected ? 'red' : 'blue',
      padding: 20,
    }),
    control: () => ({
      width: 200,
      backgroundColor: "gray",
    }),
    singleValue: (provided, state) => {
      const opacity = state.isDisabled ? 0.5 : 1;
      const transition = 'opacity 300ms';
  
      return { ...provided, opacity, transition };
    }
  }
  

  useEffect(() => {
    if (category) dispatch(categoryActions.getProductsWithCategory(category))
  }, [category, pageNum]);


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
    <div expand="sm" className=" header-with-search">

      <header id="header">
        <div className="header-top">
          <div className="container">
            
                <div className="header-top-area">
                  <div className="header-top-left">
                      <div className="logo d-flex mt-2">
                        <Link to="/">
                          <img src={logo}/>
                        </Link>
                      </div>
                  </div>
                  
                
                    <div className="head-top-right">
                      
                      <Navbar id="basic-navbar-nav">
                          <Nav className="ml-auto"></Nav>
                          {!loading && 
                          <>{isAdmin? adminLinks : isSeller ? sellerLinks : isAuthenticated ? 
                          authLinks : publicLinks}</>}
                      </Navbar>
                      {/* <Navbar.Toggle aria-controls="basic-navbar-nav" /> */}

                      <div>
                        <div className="row search-form" >
                          <div className="col-lg-3 col-12 mt-2">
                              <Select placeholder="Category" 
                              className="categorySelect" 
                              options = {categories} 
                              onChange={(e) => setCategory(e.value)} 
                              />
                          </div>
                          <div className="col-lg-8 col-12">
                            <div className="header-search" style={{display: "flex"}}>
                            
                            <div className="header-search-form">
                              <Form inline 
                                  onSubmit={(event) => {
                                    event.preventDefault();
                                    dispatch(productActions.searchProductsByKeyword(keyword));}}>
                                    <FormControl
                                      type="text" placeholder="Search a product..." 
                                      onChange={(event) => {keyword = event.target.value;}}/>
                                    <Button type="submit">Search</Button>
                              </Form>                                    
                            </div>
                          </div>

                          </div>
                      </div>
                      </div>
                
                    </div>

                    
                  
                </div>  
          </div>
        </div>

        {/* <div className="header-lower-area">
          <div className="container">
            <div className="row">
              <div className="col-lg-3 col-12 mt-2">
                  <Select placeholder="Category" className="categorySelect" options = {categories} onChange={(e) => setCategory(e.value)} />
              </div>
              <div className="col-lg-8 col-12">
                <div className="header-search clearfix" style={{display: "flex"}}>
                  
                  <div className="header-search-form">
                    <Form inline 
                        onSubmit={(event) => {
                          event.preventDefault();
                          dispatch(productActions.searchProductsByKeyword(keyword));}}>
                          <FormControl
                            type="text" placeholder="Search a product..." 
                            onChange={(event) => {keyword = event.target.value;}}/>
                          <Button type="submit">Search</Button>
                    </Form>                                    
                  </div>
                </div>

              </div>
              
            </div>
          </div>
        
        </div>
 */}



      
      </header>
      
    
      
    </div>
  );
};

export default PublicNavbar;
