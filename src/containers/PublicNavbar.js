import React, { useEffect, useState } from "react";
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from "../images/online-shopping.png";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "redux/actions";
import { cartActions } from "../redux/actions/cart.actions";
import { productActions } from "redux/actions";
import { Form, FormControl } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import shopnow from "../images/shopnow.png";
import ".././App.css";

const PublicNavbar = () => {
  const dispatch = useDispatch();
  // const [pageNum, setPageNum] = useState(1);

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const loading = useSelector((state) => state.auth.loading);

  const cart = useSelector((state) => state.cart.cartItems);
  const cartloading = useSelector((state) => state.cart.loading);
  const isCheckedout = useSelector((state) => state.cart.isCheckedout);

  useEffect(() => {
    if (isAuthenticated && !isCheckedout) {
      if (!isSeller) dispatch(cartActions.getCartItems());
    }
  }, [isCheckedout, isAuthenticated]);

  let keyword = "";

  const handleLogout = () => {
    dispatch(authActions.logout());
  };

  const currentUser = useSelector((state) => state.auth.user);
  const isSeller = currentUser && currentUser.role === "Seller";
  const isAdmin = currentUser && currentUser.role === "Admin";

  const authLinks = (
    <div className="d-flex" style={{ marginBottom: "-10px" }}>
      <Nav.Link as={Link} to="/user/profile">
        Profile
      </Nav.Link>

      <Nav.Link as={Link} to="/cart">
        <i className="fa fa-shopping-cart"></i>
        {cartloading ? (
          <sup></sup>
        ) : (
          <sup style={{ color: "red" }}>{cart?.length}</sup>
        )}
      </Nav.Link>

      <Nav.Link as={Link} to="/user/history">
        History
      </Nav.Link>

      <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
    </div>
  );

  const sellerLinks = (
    <div className="d-flex" style={{ marginBottom: "-10px" }}>
      <Nav.Link as={Link} to="/seller/profile">
        Seller
      </Nav.Link>

      <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
    </div>
  );

  const adminLinks = (
    <div className="d-flex" style={{ marginBottom: "-10px" }}>
      <Nav.Link as={Link} to="/admin/dashboard">
        Admin
      </Nav.Link>

      <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
    </div>
  );

  const publicLinks = (
    <div className="d-flex" style={{ marginBottom: "-10px" }}>
      <Nav.Link as={Link} to="/register">
        Register
      </Nav.Link>
      <Nav.Link as={Link} to="/login">
        Login
      </Nav.Link>
    </div>
  );

  return (
    <div expand="sm" className=" header-with-search">
      <header className="header">
        <div className="container">
          <div className="upper_header content_width">
            <div className="upper_header__left">
              <p>Hotline 012345678</p>
            </div>
            <div className="upper_header__right">
              {/* <div id="basic-navbar-nav"> */}
              {!loading && (
                <>
                  {isAdmin
                    ? adminLinks
                    : isSeller
                    ? sellerLinks
                    : isAuthenticated
                    ? authLinks
                    : publicLinks}
                </>
              )}
              {/* </div> */}
            </div>
          </div>

          <div className="lower_header content_width">
            <div className="logo">
              {/* <Link to="/"> */}
              <a href="/" style={{ letterSpacing: "1.5px" }}>
                <img src={shopnow} />
              </a>
              {/* </Link> */}
            </div>

            <ToastContainer />

            {!loading && (
              <>
                {isAdmin ? (
                  <div></div>
                ) : isSeller ? (
                  <div></div>
                ) : (
                  <div className="header-search-form">
                    <Form
                      inline
                      className="header-search-form-inner"
                      // style={{height: "32px"}}
                      onSubmit={(event) => {
                        event.preventDefault();
                        dispatch(
                          productActions.searchProductsByKeyword(keyword)
                        );
                      }}
                    >
                      <FormControl
                        type="text"
                        placeholder="Search a product..."
                        onChange={(event) => {
                          keyword = event.target.value;
                        }}
                      />
                      <button type="submit" className="kwSubmit">
                        <i className="fa fa-search"></i>
                      </button>
                    </Form>
                  </div>
                )}
              </>
            )}
            {/* <div className="header-search-form">
              <Form
                inline
                className="header-search-form-inner"
                // style={{height: "32px"}}
                onSubmit={(event) => {
                  event.preventDefault();
                  dispatch(productActions.searchProductsByKeyword(keyword));
                }}
              >
                <FormControl
                  type="text"
                  placeholder="Search a product..."
                  onChange={(event) => {
                    keyword = event.target.value;
                  }}
                />
                <button type="submit" className="kwSubmit">
                  <i className="fa fa-search"></i>
                </button>
              </Form>
            </div> */}
          </div>
        </div>
      </header>
    </div>
  );
};

export default PublicNavbar;
