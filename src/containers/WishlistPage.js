import React, { useEffect, useState, useMemo, useCallback, memo } from "react";
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  CircularProgress, 
  Button, 
  Container,
  Stack,
  Avatar,
  IconButton,
  Tooltip
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import ProductCard from "../components/ProductCard";
import { userActions } from "../redux/actions";
import { cartActions } from "../redux/actions/cart.actions";
import api from "../redux/api";
import { useHistory } from "react-router-dom";
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ShoppingCartOutlined as ShoppingCartOutlinedIcon,
  Home as HomeIcon,
  Search as SearchIcon,
  Star as StarIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Visibility as VisibilityIcon,
  LocalOffer as LocalOfferIcon,
  Delete as DeleteIcon,
  Close as CloseIcon
} from "@mui/icons-material";

// Custom Wishlist Card Component - Memoized to prevent unnecessary re-renders
const WishlistCard = memo(({ product, onRemove }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const currentUser = useSelector(state => state.auth.user);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemoveFromWishlist = useCallback((e) => {
    e.stopPropagation();
    
    // Safety check: ensure product and _id exist
    if (!product || !product._id || isRemoving) {
      if (process.env.NODE_ENV === 'development' && !product?._id) {
        console.error('Cannot remove from wishlist: product or product._id is missing', product);
      }
      return;
    }
    
    if (currentUser) {
      setIsRemoving(true);
      onRemove(product._id).finally(() => setIsRemoving(false));
    } else {
      // Guest wishlist logic
      const guestWishlist = JSON.parse(localStorage.getItem('guestWishlist') || '[]');
      const updatedWishlist = guestWishlist.filter(id => id !== product._id);
      localStorage.setItem('guestWishlist', JSON.stringify(updatedWishlist));
      window.location.reload(); // Simple refresh for guest users
    }
  }, [product, currentUser, onRemove, isRemoving]);

  const handleAddToCart = useCallback((e) => {
    e.stopPropagation();
    const currentPrice = product.effectivePrice || product.price || product.currentPrice || 0;
    dispatch(cartActions.addToCart(product._id, 1, currentPrice));
  }, [product, dispatch]);

  const handleViewProduct = useCallback(() => {
    history.push(`/products/${product._id}`);
  }, [product._id, history]);

  return (
    <Paper
      elevation={0}
      sx={{
        width: 320, // Fixed width
        maxWidth: '100%',
        borderRadius: 3,
        overflow: 'hidden',
        bgcolor: 'white',
        border: '1px solid #e0e0e0',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 28px rgba(0,0,0,0.12)',
          borderColor: '#ff6b6b',
        },
      }}
      onClick={handleViewProduct}
    >
      {/* Image Container */}
      <Box sx={{ position: 'relative', height: 200, overflow: 'hidden' }}>
        <Box
          component="img"
          src={product.image}
          alt={product.name}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
        />
        
        {/* Discount Badge */}
        {product.hasDiscount && (
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              bgcolor: '#ff4444',
              color: 'white',
              px: 1.5,
              py: 0.5,
              borderRadius: 2,
              fontSize: '0.75rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <LocalOfferIcon sx={{ fontSize: 14 }} />
            -{product.discountPercent}%
          </Box>
        )}

        {/* Remove from Wishlist Button */}
        <Tooltip title="Remove from wishlist" arrow placement="top">
          <IconButton
            onClick={handleRemoveFromWishlist}
            disabled={isRemoving}
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              bgcolor: 'rgba(255, 255, 255, 0.95)',
              color: '#e74c3c',
              width: 40,
              height: 40,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              '&:hover': {
                bgcolor: '#e74c3c',
                color: 'white',
                transform: 'scale(1.1)',
                boxShadow: '0 4px 12px rgba(231, 76, 60, 0.3)',
              },
              '&:disabled': {
                opacity: 0.6,
              },
              transition: 'all 0.2s ease',
            }}
          >
            {isRemoving ? (
              <CircularProgress size={20} sx={{ color: '#e74c3c' }} />
            ) : (
              <DeleteIcon sx={{ fontSize: 20 }} />
            )}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Content */}
      <Box sx={{ p: 3 }}>
        {/* Product Name */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            mb: 1,
            color: '#2c3e50',
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '2.6em',
          }}
        >
          {product.name}
        </Typography>

        {/* Brand */}
        {product.brand && (
          <Typography
            variant="body2"
            sx={{
              color: '#7f8c8d',
              mb: 1,
              fontSize: '0.85rem',
              fontWeight: 500,
            }}
          >
            {product.brand}
          </Typography>
        )}

        {/* Price Section */}
        <Box sx={{ mb: 2 }}>
          {product.hasDiscount ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Typography
                variant="h6"
                sx={{
                  color: '#e74c3c',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                }}
              >
                ${product.effectivePrice}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#95a5a6',
                  textDecoration: 'line-through',
                  fontSize: '0.9rem',
                }}
              >
                ${product.originalPrice}
              </Typography>
            </Box>
          ) : (
            <Typography
              variant="h6"
              sx={{
                color: '#2c3e50',
                fontWeight: 700,
                fontSize: '1.1rem',
              }}
            >
              ${product.price}
            </Typography>
          )}
        </Box>

        {/* Rating */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          {product.rating !== null && product.rating !== undefined ? (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    sx={{
                      fontSize: 16,
                      color: i < product.rating ? '#f39c12' : '#ecf0f1',
                    }}
                  />
                ))}
              </Box>
              <Typography variant="body2" sx={{ color: '#7f8c8d', fontSize: '0.8rem' }}>
                ({product.reviewCount || 0})
              </Typography>
            </>
          ) : (
            <Typography variant="body2" sx={{ color: '#95a5a6', fontSize: '0.8rem', fontStyle: 'italic' }}>
              No reviews yet
            </Typography>
          )}
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddToCart}
            sx={{
              flex: 1,
              bgcolor: '#3498db',
              color: 'white',
              fontWeight: 600,
              py: 1,
              '&:hover': {
                bgcolor: '#2980b9',
              },
            }}
          >
            Add to Cart
          </Button>
          <IconButton
            onClick={handleViewProduct}
            sx={{
              bgcolor: '#ecf0f1',
              color: '#7f8c8d',
              '&:hover': {
                bgcolor: '#bdc3c7',
                color: 'white',
              },
            }}
          >
            <VisibilityIcon />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
});

const WishlistPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const reduxWishlist = useSelector((state) => state.user.wishlist);
  const wishlistLoading = useSelector((state) => state.user.loading);
  const [guestWishlist, setGuestWishlist] = useState([]);
  const [guestLoading, setGuestLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(userActions.getWishlist());
    } else {
      // Guest: fetch product details for guestWishlist
      const ids = JSON.parse(localStorage.getItem('guestWishlist') || '[]');
      if (ids.length === 0) {
        setGuestWishlist([]);
        return;
      }
      setGuestLoading(true);
      Promise.all(ids.map(id => api.get(`/products/${id}`)))
        .then(responses => {
          setGuestWishlist(responses.map(res => res.data.data));
        })
        .catch(() => setGuestWishlist([]))
        .finally(() => setGuestLoading(false));
    }
  }, [isAuthenticated, dispatch]);

  // Memoized filter function
  const filterValidProducts = useCallback((products) => {
    if (!Array.isArray(products)) return [];
    return products.filter(product => product && product._id);
  }, []);
  
  // Memoized wishlist products - only recalculate when reduxWishlist or guestWishlist changes
  const wishlistProducts = useMemo(() => {
    const products = isAuthenticated ? reduxWishlist : guestWishlist;
    return filterValidProducts(products);
  }, [isAuthenticated, reduxWishlist, guestWishlist, filterValidProducts]);

  // Memoized remove handler
  const handleRemove = useCallback((productId) => {
    return dispatch(userActions.removeFromWishlist(productId));
  }, [dispatch]);

  if (!isAuthenticated) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafb', py: 8 }}>
        <Container maxWidth="lg">
          {/* Login Required Section */}
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            {/* Animated Heart Icon */}
            <Box sx={{ 
              position: 'relative', 
              display: 'inline-block',
              mb: 4,
              animation: 'pulse 2s ease-in-out infinite'
            }}>
              <Box sx={{
                width: 200,
                height: 200,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
                boxShadow: '0 20px 40px rgba(255, 107, 107, 0.3)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Background Pattern */}
                <Box sx={{
                  position: 'absolute',
                  top: -20,
                  right: -20,
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)',
                }} />
                <Box sx={{
                  position: 'absolute',
                  bottom: -30,
                  left: -30,
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.05)',
                }} />
                
                <FavoriteIcon sx={{ 
                  fontSize: 80, 
                  color: 'white',
                  opacity: 0.9,
                  zIndex: 1
                }} />
              </Box>
              
              {/* Floating Hearts */}
              <Box sx={{
                position: 'absolute',
                top: 20,
                right: 20,
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: '#ff6b6b',
                animation: 'bounce 2s infinite',
                zIndex: 2
              }} />
              <Box sx={{
                position: 'absolute',
                top: 40,
                left: 20,
                width: 15,
                height: 15,
                borderRadius: '50%',
                background: '#ff8e8e',
                animation: 'bounce 2s infinite 0.5s',
                zIndex: 2
              }} />
              <Box sx={{
                position: 'absolute',
                bottom: 30,
                right: 40,
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: '#ffa8a8',
                animation: 'bounce 2s infinite 1s',
                zIndex: 2
              }} />
            </Box>

            {/* Action Buttons */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center">
              <Button 
                variant="contained" 
                size="large" 
                startIcon={<HomeIcon />}
                onClick={() => history.push('/')}
                sx={{ 
                  borderRadius: 4, 
                  px: 6, 
                  py: 2, 
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  bgcolor: '#00bfae', 
                  '&:hover': { 
                    bgcolor: '#43e6c2',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0,191,174,0.3)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Go to Home
              </Button>
              
              <Button 
                variant="outlined" 
                size="large" 
                startIcon={<SearchIcon />}
                onClick={() => history.push('/')}
                sx={{ 
                  borderRadius: 4, 
                  px: 6, 
                  py: 2, 
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  borderColor: '#ff6b6b',
                  color: '#ff6b6b',
                  '&:hover': { 
                    borderColor: '#ee5a52',
                    color: '#ee5a52',
                    bgcolor: 'rgba(255, 107, 107, 0.05)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(255, 107, 107, 0.2)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Browse Products
              </Button>
            </Stack>
          </Box>

          {/* CSS Animations */}
          <style jsx>{`
            @keyframes pulse {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.05); }
            }
            
            @keyframes bounce {
              0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
              40% { transform: translateY(-10px); }
              60% { transform: translateY(-5px); }
            }
          `}</style>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafb', py: 6 }}>
      <Container maxWidth="lg">

        {wishlistProducts && wishlistProducts.length > 0 ? (
          <Grid container spacing={3} justifyContent="flex-start">
            {wishlistProducts.map(product => (
              <Grid item xs={12} sm={6} md={4} key={product._id} sx={{ display: 'flex', justifyContent: 'center' }}>
                <WishlistCard 
                  product={product} 
                  onRemove={handleRemove}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          /* Empty Wishlist State */
          <Box sx={{ textAlign: 'center', py: 8 }}>
            {/* Animated Empty Heart */}
            <Box sx={{ 
              position: 'relative', 
              display: 'inline-block',
              mb: 4,
              animation: 'float 3s ease-in-out infinite'
            }}>
              <Box sx={{
                width: 200,
                height: 200,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
                boxShadow: '0 20px 40px rgba(255, 107, 107, 0.3)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Background Pattern */}
                <Box sx={{
                  position: 'absolute',
                  top: -20,
                  right: -20,
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)',
                }} />
                <Box sx={{
                  position: 'absolute',
                  bottom: -30,
                  left: -30,
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.05)',
                }} />
                
                <FavoriteIcon sx={{ 
                  fontSize: 80, 
                  color: 'white',
                  opacity: 0.9,
                  zIndex: 1
                }} />
              </Box>
              
              {/* Floating Elements */}
              <Box sx={{
                position: 'absolute',
                top: 20,
                right: 20,
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: '#ff6b6b',
                animation: 'bounce 2s infinite',
                zIndex: 2
              }} />
              <Box sx={{
                position: 'absolute',
                top: 40,
                left: 20,
                width: 15,
                height: 15,
                borderRadius: '50%',
                background: '#ff8e8e',
                animation: 'bounce 2s infinite 0.5s',
                zIndex: 2
              }} />
              <Box sx={{
                position: 'absolute',
                bottom: 30,
                right: 40,
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: '#ffa8a8',
                animation: 'bounce 2s infinite 1s',
                zIndex: 2
              }} />
            </Box>

            {/* Main Content */}
            <Typography variant="h3" fontWeight={800} sx={{ 
              mb: 2, 
              color: '#222',
              background: 'linear-gradient(90deg, #ff6b6b 30%, #ee5a52 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block'
            }}>
              Your wishlist is empty
            </Typography>
            
            <Typography variant="h6" color="text.secondary" sx={{ mb: 6, maxWidth: 500, mx: 'auto', lineHeight: 1.6 }}>
              Start adding items you love to your wishlist! 
              <br />
              Browse our collection and save your favorites for later.
            </Typography>

            {/* Action Buttons */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center">
              <Button 
                variant="contained" 
                size="large" 
                startIcon={<ShoppingCartOutlinedIcon />}
                onClick={() => history.push('/')}
                sx={{ 
                  borderRadius: 4, 
                  px: 6, 
                  py: 2, 
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  bgcolor: '#00bfae', 
                  '&:hover': { 
                    bgcolor: '#43e6c2',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0,191,174,0.3)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Start Shopping
              </Button>
              
              <Button 
                variant="outlined" 
                size="large" 
                startIcon={<StarIcon />}
                onClick={() => history.push('/')}
                sx={{ 
                  borderRadius: 4, 
                  px: 6, 
                  py: 2, 
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  borderColor: '#ff6b6b',
                  color: '#ff6b6b',
                  '&:hover': { 
                    borderColor: '#ee5a52',
                    color: '#ee5a52',
                    bgcolor: 'rgba(255, 107, 107, 0.05)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(255, 107, 107, 0.2)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Browse Products
              </Button>
            </Stack>
          </Box>
        )}

        {/* CSS Animations */}
        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
          }
        `}</style>
      </Container>
    </Box>
  );
};

export default WishlistPage; 