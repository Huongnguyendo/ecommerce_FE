import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from "../images/shopping-logo.jpg";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "redux/actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ".././App.css";

const PublicNavbar = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const loading = useSelector((state) => state.auth.loading);


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
            <a className="cart-drawer">
              <i class="fa fa-shopping-cart"></i>
            </a>
      </Nav.Link>
      <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
    </Nav>
  );

  const sellerLinks = (
    <Nav>
        <Nav.Link as={Link} to="/seller/profile">
        <FontAwesomeIcon icon="user" size="sm" /> Seller Profile
      </Nav.Link>
      
      <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
    </Nav>
  );

  const adminLinks = (
    <Nav>
        <Nav.Link as={Link} to="/admin/profile">
        <FontAwesomeIcon icon="user" size="sm" /> Admin Profile
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
    <Navbar expand="sm" className="container header-with-search">
      
      <Navbar.Brand as={Link} to="/" className="mr-auto header-with-search__logo-section">
        <img src={logo} alt="logo" height="60px" />
        <span style={{ marginLeft: "10px", color: "#161b45" }}></span>
      </Navbar.Brand>

      {/* <div className="header-with-search__search-section">
        <div className="searchbar">
          <div className="searchbar__main">
            <form role="search" className="searchbar-input">
              <input type="text" placeholder="Search" className="searchbar-input__input" />
            </form>
            <button type="button" className="search-btn btn btn-solid-primary">
              <i class="fa fa-search"></i>
            </button>
          </div>
          
        </div>
      </div> */}
      

      {/* <div className="header-with-search__cart-wrapper">
            <div role="button" className="stardust-popover__target">
              <div className="cart-drawer-container">
                <a className="cart-drawer">
                  <i class="fa fa-shopping-cart"></i>
                </a>
              </div>
            </div>
          </div> */}
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto"></Nav>
        {!loading && 
        <>{isAdmin? adminLinks : isSeller ? sellerLinks : isAuthenticated ? 
        authLinks : publicLinks}</>}
      </Navbar.Collapse>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      
    </Navbar>
  );
};

export default PublicNavbar;
