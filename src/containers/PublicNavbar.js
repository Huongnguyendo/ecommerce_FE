import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import shopnow from "../images/shopnow.png";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "redux/actions";
import { cartActions } from "../redux/actions/cart.actions";
import { AppBar, Toolbar, IconButton, InputBase, Avatar, Badge, Box, Typography, Button, Paper, useTheme, Menu, MenuItem, Tooltip, useMediaQuery } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MenuIcon from '@mui/icons-material/Menu';

const PublicNavbar = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const cart = useSelector((state) => state.cart.cartItems) || [];
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
  }, [isCheckedout, isAuthenticated, dispatch, isSeller]);
  
  const badgeCount = isAuthenticated 
    ? (cartloading ? 0 : (cart?.length || 0))
    : guestCartCount;

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
    if (isMobile) setSearchOpen(false);
  };

  // User menu
  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  // Mobile menu + search
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);
  const handleMobileMenuOpen = (event) => setMobileMenuAnchorEl(event.currentTarget);
  const handleMobileMenuClose = () => setMobileMenuAnchorEl(null);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleLogout = () => {
    dispatch(authActions.logout());
    handleMenuClose();
  };

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
        <Toolbar sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 1, minHeight: { xs: 'auto', sm: 72 }, px: { xs: 1, sm: 2 } }}>
          {/* Top row: logo + actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Link to="/">
                <Box component="img" src={shopnow} alt="Logo" sx={{ height: 40, width: 40, borderRadius: 2, mr: 1.5 }} />
              </Link>
              <Typography
                variant="h6"
                fontWeight={700}
                sx={{ letterSpacing: 1, color: theme.palette.primary.main, display: { xs: 'none', sm: 'block' } }}
              >
                ShopNow
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Mobile: search + hamburger */}
              <Box sx={{ display: { xs: 'flex', sm: 'none' }, alignItems: 'center', gap: 1 }}>
                <Paper
                  component="form"
                  onSubmit={handleSearchSubmit}
                  sx={{
                    p: searchOpen ? '2px 8px' : 0,
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: 8,
                    boxShadow: 'none',
                    background: searchOpen ? 'rgba(255,255,255,0.9)' : 'transparent',
                    border: searchOpen ? '1px solid #e0e7ef' : 'none',
                    width: searchOpen ? 200 : 36,
                    transition: 'all 0.2s ease',
                  }}
                >
                  <IconButton color="primary" onClick={() => setSearchOpen((prev) => !prev)}>
                    <SearchIcon />
                  </IconButton>
                  {searchOpen && (
                    <InputBase
                      sx={{ ml: 0.5, flex: 1 }}
                      placeholder="Search"
                      inputProps={{ 'aria-label': 'search products' }}
                      value={keyword}
                      onChange={e => setKeyword(e.target.value)}
                      autoFocus
                    />
                  )}
                </Paper>
                <IconButton color="primary" onClick={handleMobileMenuOpen}>
                  <MenuIcon />
                </IconButton>
              </Box>

              {/* Desktop actions */}
              <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1 }}>
                <Tooltip title="Wishlist">
                  <IconButton color="primary" component={Link} to="/wishlist">
                    <FavoriteBorderIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Cart">
                  <IconButton color="primary" component={Link} to="/cart">
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
              </Box>
              {isAuthenticated && currentUser ? (
                <>
                  <Tooltip title={currentUser.name || "Profile"}>
                    <IconButton onClick={handleMenuOpen} sx={{ p: 0, display: { xs: 'none', sm: 'flex' } }}>
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
                <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1 }}>
                  <Button color="primary" startIcon={<AppRegistrationIcon />} component={Link} to="/register">Register</Button>
                  <Button color="primary" startIcon={<LoginIcon />} component={Link} to="/login">Login</Button>
                </Box>
            )}
            </Box>
          </Box>

          {/* Search row */}
          <Box sx={{ width: '100%', display: { xs: 'none', sm: 'flex' }, alignItems: 'center' }}>
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
                width: '100%',
              }}
            >
              <SearchIcon sx={{ color: '#b0b8c1', mr: 1 }} />
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search products..."
                inputProps={{ 'aria-label': 'search products' }}
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
              />
            </Paper>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile menu: wishlist/cart/auth */}
      <Menu
        anchorEl={mobileMenuAnchorEl}
        open={Boolean(mobileMenuAnchorEl)}
        onClose={handleMobileMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem component={Link} to="/wishlist" onClick={handleMobileMenuClose}>Wishlist</MenuItem>
        <MenuItem component={Link} to="/cart" onClick={handleMobileMenuClose}>Cart ({badgeCount})</MenuItem>
        {isAuthenticated && currentUser ? (
          <>
            <MenuItem component={Link} to="/user/profile" onClick={handleMobileMenuClose}>Profile</MenuItem>
            <MenuItem component={Link} to="/user/history" onClick={handleMobileMenuClose}>History</MenuItem>
            <MenuItem onClick={() => { handleLogout(); handleMobileMenuClose(); }}>Logout</MenuItem>
          </>
        ) : (
          <>
            <MenuItem component={Link} to="/register" onClick={handleMobileMenuClose}>Register</MenuItem>
            <MenuItem component={Link} to="/login" onClick={handleMobileMenuClose}>Login</MenuItem>
          </>
        )}
      </Menu>
    </Box>
  );
};

export default PublicNavbar;
