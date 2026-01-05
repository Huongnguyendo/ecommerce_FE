<<<<<<< HEAD
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import shopnow from "../images/shopnow.png";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "redux/actions";
import { cartActions } from "../redux/actions/cart.actions";
import { AppBar, Toolbar, IconButton, InputBase, Avatar, Badge, Box, Typography, Button, Paper, useTheme, Menu, MenuItem, Tooltip } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const PublicNavbar = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const theme = useTheme();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const cart = useSelector((state) => state.cart.cartItems) || [];
=======
import React, { useEffect } from "react";
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
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

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const loading = useSelector((state) => state.auth.loading);

  const cart = useSelector((state) => state.cart.cartItems);
>>>>>>> master
  const cartloading = useSelector((state) => state.cart.loading);
  const isCheckedout = useSelector((state) => state.cart.isCheckedout);
  const currentUser = useSelector((state) => state.auth.user);
  const isSeller = currentUser && currentUser.role === "Seller";
  const isAdmin = currentUser && currentUser.role === "Admin";
  
  // For guests: poll localStorage every 300ms for instant updates
  const [guestCartCount, setGuestCartCount] = useState(0);
  
  useEffect(() => {
    if (!isAuthenticated) {
      const checkCart = () => {
        const stored = JSON.parse(localStorage.getItem('guestCart') || '[]');
        setGuestCartCount(stored.length);
      };
      checkCart();
      const interval = setInterval(checkCart, 300);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && !isCheckedout) {
      if (!isSeller) dispatch(cartActions.getCartItems());
    }
<<<<<<< HEAD
  }, [isCheckedout, isAuthenticated, dispatch, isSeller]);
  
  const badgeCount = isAuthenticated 
    ? (cartloading ? 0 : (cart?.length || 0))
    : guestCartCount;
=======
  }, [isCheckedout, isAuthenticated]);
>>>>>>> master

  // Search state
  const [keyword, setKeyword] = useState("");
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (keyword.trim()) {
      history.push(`/?search=${encodeURIComponent(keyword.trim())}`);
    } else {
      // Clear search and show all products
      history.push('/');
    }
  };

  // User menu
  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    dispatch(authActions.logout());
    handleMenuClose();
  };

<<<<<<< HEAD
  // Glassmorphic style helper
  const glass = {
    background: 'rgba(255,255,255,0.7)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)',
    backdropFilter: 'blur(12px)',
    borderRadius: 6,
    border: '1px solid rgba(255,255,255,0.18)',
  };

  // Hide navbar for admin users
  if (isAdmin) {
    return null;
  }

  return (
    <Box sx={{ width: '100%', mb: 3 }}>
      {/* Removed hotline bar for a cleaner look */}
      <AppBar position="static" elevation={0} sx={{ ...glass, bgcolor: 'rgba(255,255,255,0.7)', color: '#222', p: 1, borderRadius: 4, mt: 1, mx: 'auto', maxWidth: 1400 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: 72, px: { xs: 1, sm: 2 } }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Link to="/">
              <Box component="img" src={shopnow} alt="Logo" sx={{ height: 44, width: 44, borderRadius: 2, mr: 2 }} />
            </Link>
            <Typography variant="h6" fontWeight={700} sx={{ letterSpacing: 1, color: theme.palette.primary.main }}>ShopNow</Typography>
          </Box>
          {/* Search Bar (centered) */}
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', mx: 2 }}>
            <Paper
              component="form"
              onSubmit={handleSearchSubmit}
              sx={{
                p: '2px 8px',
                display: 'flex',
                alignItems: 'center',
                borderRadius: 8,
                boxShadow: 'none',
                background: 'rgba(255,255,255,0.9)',
                border: '1px solid #e0e7ef',
                minWidth: { xs: 120, sm: 250, md: 350 },
                maxWidth: 500,
                flex: 1,
              }}
            >
              <SearchIcon sx={{ color: '#b0b8c1', mr: 1 }} />
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search a product..."
                inputProps={{ 'aria-label': 'search products' }}
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
              />
            </Paper>
          </Box>
          {/* Right side buttons (far right) */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', minWidth: 180 }}>
            <Tooltip title="Wishlist">
              <IconButton color="primary" component={Link} to="/wishlist">
                <FavoriteBorderIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Cart">
              <IconButton color="primary" component={Link} to="/cart" sx={{ ml: 1 }}>
                <Badge 
                  badgeContent={badgeCount} 
                  color="error"
                  showZero={false}
                  max={99}
                >
                  <ShoppingCartOutlinedIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            {isAuthenticated && currentUser ? (
              <>
                <Tooltip title={currentUser.name || "Profile"}>
                  <IconButton onClick={handleMenuOpen} sx={{ p: 0, ml: 1 }}>
                    <Avatar alt={currentUser.name} src={currentUser.avatarUrl || undefined} />
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                  <MenuItem component={Link} to="/user/profile" onClick={handleMenuClose}>Profile</MenuItem>
                  <MenuItem component={Link} to="/user/history" onClick={handleMenuClose}>History</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button color="primary" startIcon={<AppRegistrationIcon />} component={Link} to="/register" sx={{ ml: 2, mr: 1 }}>Register</Button>
                <Button color="primary" startIcon={<LoginIcon />} component={Link} to="/login">Login</Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
=======
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
>>>>>>> master
  );
};

export default PublicNavbar;
