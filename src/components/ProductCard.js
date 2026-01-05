import React from "react";
<<<<<<< HEAD
import { Card, CardMedia, CardContent, CardActions, Typography, Button, Chip, Box } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { useDispatch, useSelector } from 'react-redux';
import { cartActions } from '../redux/actions/cart.actions';

const ProductCard = ({ product, gotoProductDetail }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.auth.user);

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent card click
    // Use Redux action for both guest and logged-in users (handles notifications)
    dispatch(cartActions.addToCart(product._id, 1, product.effectivePrice || product.price));
  };

  if (!product) return null;
  
  // Calculate discount info if not provided
  const originalPrice = Number(product.originalPrice || product.price || 0);
  const effectivePrice = Number(product.effectivePrice || product.price || 0);
  const calculatedDiscount = originalPrice - effectivePrice;
  
  // Check for discount: hasDiscount flag, discountPercent > 0, or price difference
  // For Today's Deals, all products should have discounts, so be more lenient
  const hasDiscount = product.hasDiscount || 
                      (product.discountPercent > 0) || 
                      (calculatedDiscount > 0.01 && effectivePrice < originalPrice && originalPrice > 0);
  
  const discountAmount = Number(product.discountAmount || (calculatedDiscount > 0 ? calculatedDiscount : 0));
  
  // For Today's Deals section, if discountPercent exists and > 0, show discount info
  // Be lenient: if discountPercent > 0, show discount even if discountAmount isn't calculated yet
  const shouldShowDiscount = hasDiscount || 
                             (product.discountPercent > 0) || 
                             (calculatedDiscount > 0.01 && originalPrice > effectivePrice);
  
  return (
    <Card
      onClick={() => gotoProductDetail(product._id)}
      sx={{
        width: { xs: '100%', sm: 200, md: 240 },
        minWidth: 180,
        maxWidth: 260,
        height: 340,
        boxShadow: '0 4px 24px 0 rgba(30,144,255,0.07)',
        background: '#f8fafb',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 0,
        mx: 'auto',
        position: 'relative',
        transition: 'transform 0.18s, box-shadow 0.18s',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-4px) scale(1.03)',
          boxShadow: '0 8px 32px 0 rgba(30,144,255,0.13)',
          background: '#f0f6fa',
        },
      }}
    >
      {/* Discount Badge */}
      {shouldShowDiscount && (
        <Chip
          icon={<LocalOfferIcon />}
          label={`-${product.discountPercent || (hasDiscount && originalPrice > 0 ? Math.round((discountAmount / originalPrice) * 100) : 0)}%`}
          color="error"
          size="small"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 1,
            fontWeight: 700,
            fontSize: '0.75rem',
            '& .MuiChip-icon': {
              fontSize: '0.875rem'
            }
          }}
        />
      )}
      
      {/* Product Image */}
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', pt: 3 }}>
        <Box
          component="img"
          src={product.image}
          alt={product.name}
          sx={{
            width: 120,
            height: 120,
            objectFit: 'contain',
            mb: 1,
          }}
        />
      </Box>
      {/* Product Info */}
      <Box sx={{ width: '100%', textAlign: 'center', px: 2, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 120 }}>
        <Typography 
          variant="subtitle1" 
          fontWeight={700} 
          sx={{ 
            mb: 0.5, 
            lineHeight: 1.2,
            height: 40,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}
        >
          {product.name}
        </Typography>
        <Box sx={{ width: '100%', height: 40, mb: 0.5, overflow: 'hidden', display: 'flex', alignItems: 'flex-start' }}>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              fontSize: 13, 
              width: '100%', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis', 
              display: '-webkit-box', 
              WebkitLineClamp: 2, 
              WebkitBoxOrient: 'vertical' 
            }}
          >
            {product.description}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 0.3, width: '100%' }}>
          {shouldShowDiscount && (originalPrice > effectivePrice || product.discountPercent > 0) ? (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <Typography 
                variant="h6" 
                fontWeight={700} 
                color="error.main" 
                sx={{ 
                  textDecoration: 'line-through', 
                  textDecorationColor: 'error.main',
                  textDecorationThickness: '2px',
                  opacity: 0.7, 
                  fontSize: '1rem' 
                }}
              >
                ${originalPrice.toFixed(2)}
              </Typography>
              <Typography variant="h5" fontWeight={800} color="primary.main">
                ${effectivePrice.toFixed(2)}
              </Typography>
            </Box>
          ) : (
            <Typography variant="h5" fontWeight={800} color="primary">
              ${(product.price || 0).toFixed(2)}
            </Typography>
          )}
        </Box>
      </Box>
      {/* Divider and Add Button */}
      <Box sx={{ width: '100%', px: 2, pb: 2 }}>
        <Box sx={{
          width: '100%',
          height: 32,
          bgcolor: '#f2f6f7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mt: 0.3,
        }}>
          <Button
            onClick={handleAddToCart}
            sx={{
              minWidth: 0,
              width: 36,
              height: 36,
              bgcolor: '#e8f0f2',
              color: 'primary.main',
              fontSize: 28,
              boxShadow: 'none',
              '&:hover': { bgcolor: '#d0e6ee' },
            }}
          >
            <AddIcon fontSize="inherit" />
          </Button>
        </Box>
      </Box>
    </Card>
=======
import { Badge } from "react-bootstrap";
import "App.css";

const ProductCard = ({ product, gotoProductDetail }) => {
  return (
    product && (
      <div className="productCard" style={{ borderRadius: "15px" }}>
        <div
          onClick={() => {
            gotoProductDetail(product._id);
          }}
        >
          <div className="productCardImg">
            {product.image && <img src={product.image} />}
          </div>
          <div className="productCardBody">
            <Badge
              className="product"
              variant="warning"
              style={{ fontSize: "12px" }}
            >
              {product.category}
            </Badge>
            <h3 className="productCardName">{product.name}</h3>
            <p className="productCardPrice" style={{ paddingLeft: "10px" }}>
              ${product.price}
            </p>
            <div className="productCardDes-Btn">
              <p className="productCardDescription">
                {product.description.length < 50
                  ? product.description
                  : product.description.slice(0, 50) + "..."}
              </p>
              <button
                className="productCardBtn"
                onClick={() => {
                  gotoProductDetail(product._id);
                }}
              >
                DETAILS
              </button>
            </div>
          </div>
        </div>
      </div>
    )
>>>>>>> master
  );
};

export default ProductCard;
