import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { productActions, cartActions, userActions } from "redux/actions";
import ReviewList from "components/ReviewList";
import ReviewForm from "components/ReviewForm";
import { Box, Paper, Typography, Button, Chip, Avatar, Divider, TextField, MenuItem, Stack } from '@mui/material';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import moment from "moment";
import { enqueueSnackbar } from 'notistack';


const ProductDetailPage = () => {
  let { id } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();

  let productDetail = useSelector((state) => state.product.selectedProduct);
  const loading = useSelector((state) => state.product.loading);

  // add to cart function
  const [quantity, setQuantity] = useState(1);

  // add rating
  const [rating, setRating] = useState(5);

  // Use effective price if available, otherwise fallback to original price
  let currentPrice = productDetail?.effectivePrice || productDetail?.price;
  const currentUser = useSelector((state) => state.auth.user);

  const handleAddToCart = () => {
    // Use Redux action for both guest and logged-in users (handles notifications)
      dispatch(cartActions.addToCart(id, quantity, currentPrice));
  };

  const handleBuyNow = () => {
    // Use Redux action for both guest and logged-in users
    dispatch(cartActions.addToCart(id, 1, currentPrice));
    history.push('/cart');
  };

  // review writing function
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const submitLoading = useSelector((state) => state.product.submitLoading);
  const [reviewText, setReviewText] = useState("");
  let [averageRating, setAverageRating] = useState(0);
  const reviews = useSelector((state) => state.product.reviews);
  const reviewsLoading = useSelector((state) => state.product.reviewsLoading);

  const handleInputChange = (e) => {
    setReviewText(e.target.value);
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    dispatch(productActions.createReview(id, reviewText, rating));
    setReviewText("");
    setRating(5);
  };

  // const handleGoBackClick = (e) => {
  //   history.goBack();
  // };

  // Gallery and other product info
  const gallery = productDetail?.gallery || [productDetail?.image];
  const [mainImage, setMainImage] = useState(productDetail?.image);
  const brand = productDetail?.brand || 'ShopNow';
  const sku = productDetail?._id || '';
  const categories = productDetail?.category ? productDetail.category.split(',').map(c => c.trim()) : [];

  useEffect(() => {
    if (productDetail?.image) setMainImage(productDetail.image);
  }, [productDetail]);

  useEffect(() => {
    if (id) {
      dispatch(productActions.getProductDetail(id));
      dispatch(productActions.getProductReviews(id));
    }
  }, [id]);

  // Hybrid Add to Wishlist handler
  const handleAddToWishlist = () => {
    if (currentUser) {
      dispatch(userActions.addToWishlist(id));
    } else {
      let guestWishlist = JSON.parse(localStorage.getItem('guestWishlist') || '[]');
      if (!guestWishlist.includes(id)) {
        guestWishlist.push(id);
        localStorage.setItem('guestWishlist', JSON.stringify(guestWishlist));
        enqueueSnackbar('Added to wishlist!', { variant: 'success' });
      } else {
        enqueueSnackbar('Already in wishlist', { variant: 'info' });
      }
    }
  };

  // Show skeleton while loading
  if (loading || !productDetail) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 6, mb: 6, px: 2 }}>
        <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ width: '100%', height: 400, bgcolor: '#f0f0f0', borderRadius: 2 }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ height: 40, bgcolor: '#f0f0f0', borderRadius: 1, mb: 2 }} />
            <Box sx={{ height: 24, bgcolor: '#f0f0f0', borderRadius: 1, mb: 2, width: '60%' }} />
            <Box sx={{ height: 100, bgcolor: '#f0f0f0', borderRadius: 1, mb: 2 }} />
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 6, mb: 6, px: 2 }}>
      {productDetail && (
        <Paper elevation={0} sx={{ p: { xs: 2, md: 4 }, borderRadius: 6, mb: 5, bgcolor: '#f8fafb' }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 5 }}>
            {/* Left: Product Image & Gallery */}
            <Box sx={{ flex: 1.1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: '#f4f8fb', borderRadius: 5, p: 3, position: 'relative', minWidth: 320 }}>
              {/* Main image */}
              <Box
                component="img"
                src={mainImage}
                alt={productDetail.name}
                sx={{
                  width: { xs: 220, sm: 320, md: 340 },
                  height: { xs: 220, sm: 320, md: 340 },
                  objectFit: 'contain',
                  borderRadius: 4,
                  boxShadow: '0 8px 32px 0 rgba(30,144,255,0.10)',
                  bgcolor: '#fff',
                  mb: 2,
                }}
              />
            </Box>
            {/* Right: Product Info */}
            <Box sx={{ flex: 1.3, display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 320 }}>
              {/* Brand/store */}
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>{brand}</Typography>
              {/* Name */}
              <Typography variant="h4" fontWeight={800} sx={{ mb: 1, color: '#222' }}>{productDetail.name}</Typography>
              {/* Rating */}
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                {reviews?.length > 0 ? (
                  <>
                    <StarIcon sx={{ color: '#ffc107', fontSize: 22, mr: 0.5 }} />
                    <Typography variant="body1" fontWeight={600}>{parseFloat(averageRating).toFixed(1)}</Typography>
                    <Typography variant="body2" color="text.secondary">Rating</Typography>
                    <Typography variant="body2" color="primary" sx={{ ml: 1, textDecoration: 'underline', cursor: 'pointer' }}>
                      ({reviews?.length || 0} reviews)
                    </Typography>
                  </>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    No reviews yet
                  </Typography>
                )}
              </Stack>
              {/* Price */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                {productDetail?.hasDiscount ? (
                  <>
                    <Typography variant="h3" fontWeight={900} sx={{ color: '#f44336' }}>
                      {productDetail.effectivePrice}<Box component="span" sx={{ fontSize: 22, fontWeight: 400 }}>$</Box>
                    </Typography>
                    <Typography variant="h4" fontWeight={600} sx={{ color: '#999', textDecoration: 'line-through' }}>
                      {productDetail.originalPrice}<Box component="span" sx={{ fontSize: 18, fontWeight: 400 }}>$</Box>
                    </Typography>
                    <Chip
                      icon={<LocalOfferIcon />}
                      label={`-${productDetail.discountPercent}%`}
                      color="error"
                      size="medium"
                      sx={{
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        '& .MuiChip-icon': {
                          fontSize: '1rem'
                        }
                      }}
                    />
                  </>
                ) : (
                  <Typography variant="h3" fontWeight={900} sx={{ color: '#222' }}>
                    {productDetail.price}<Box component="span" sx={{ fontSize: 22, fontWeight: 400 }}>$</Box>
                  </Typography>
                )}
              </Box>
              <Divider sx={{ my: 2 }} />
              {/* Action buttons */}
              <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<ShoppingCartOutlinedIcon />}
                  sx={{ borderRadius: 4, fontWeight: 700, px: 5, bgcolor: '#00bfae', color: '#fff', '&:hover': { bgcolor: '#43e6c2' } }}
                  onClick={handleAddToCart}
                  disabled={productDetail.inStockNum <= 0}
                >
                  Add to cart
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  sx={{ borderRadius: 4, fontWeight: 700, px: 5, bgcolor: '#e0f7fa', color: '#00bfae', '&:hover': { bgcolor: '#b2fefa' } }}
                  onClick={handleBuyNow}
                >
                  Buy now
                </Button>
              </Stack>
              {/* Wishlist/Compare */}
              <Stack direction="row" spacing={2} sx={{ mb: 2, mt: 2 }}>
                <Button startIcon={<FavoriteBorderIcon />} sx={{ color: '#222', fontWeight: 600, textTransform: 'none' }} onClick={handleAddToWishlist}>ADD TO WISHLIST</Button>
              </Stack>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">SKU: <b>{sku}</b></Typography>
                <Typography variant="body2" color="text.secondary">Categories: {categories.map((cat, idx) => <Box key={cat} component="span" sx={{ color: '#00bfae', textDecoration: 'underline', cursor: 'pointer', ml: idx ? 1 : 0 }}>{cat}</Box>)}</Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, mt: 1 }}>
                {productDetail.description}
              </Typography>
            </Box>
          </Box>
        </Paper>
      )}
      {/* Enhanced Reviews Section */}
      <Paper elevation={1} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, mb: 5, bgcolor: '#fafafa' }}>
        {/* Review Header */}
        <Typography variant="h5" fontWeight={800} sx={{ mb: 4, color: '#222' }}>
          Product Reviews
        </Typography>

        {/* Overall Rating Summary */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, mb: 4 }}>
          {/* Left: Overall Rating */}
          <Box sx={{ flex: 1, textAlign: 'center', p: 3, bgcolor: '#fff', borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <Typography variant="h2" fontWeight={900} sx={{ color: '#00bfae', mb: 1 }}>
              {reviews?.length > 0 ? `${parseFloat(averageRating).toFixed(1)}/5` : 'No Rating'}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon key={star} sx={{ color: '#ffc107', fontSize: 28 }} />
              ))}
            </Box>
            <Typography variant="h6" fontWeight={600} sx={{ color: '#666', mb: 2 }}>
              {reviews?.length || 0} reviews
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: '#f44336',
                color: '#fff',
                fontWeight: 700,
                px: 4,
                py: 1.5,
                borderRadius: 3,
                '&:hover': { bgcolor: '#d32f2f' }
              }}
              onClick={() => document.getElementById('review-form')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Write a Review
                        </Button>
          </Box>

          {/* Right: Star Distribution */}
          <Box sx={{ flex: 1.5, p: 3, bgcolor: '#fff', borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 3, color: '#222' }}>
              Rating Distribution
            </Typography>
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviews?.filter(r => Math.round(r.rating) === star).length || 0;
              const percentage = reviews?.length ? (count / reviews.length) * 100 : 0;
              return (
                <Box key={star} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body2" sx={{ minWidth: 20, mr: 1 }}>{star}</Typography>
                  <StarIcon sx={{ color: '#ffc107', fontSize: 16, mr: 1 }} />
                  <Box sx={{ flex: 1, height: 8, bgcolor: '#e0e0e0', borderRadius: 4, mr: 2, position: 'relative' }}>
                    <Box
                      sx={{
                        height: '100%',
                        bgcolor: percentage > 0 ? '#f44336' : '#e0e0e0',
                        borderRadius: 4,
                        width: `${percentage}%`,
                        transition: 'width 0.3s ease'
                      }}
                    />
                  </Box>
                  <Typography variant="body2" sx={{ minWidth: 30, color: '#666' }}>
                    {count}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>



        {/* Individual Reviews */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 3, color: '#222' }}>
            Customer Reviews
          </Typography>
          {reviewsLoading ? (
            <Typography variant="body2" color="text.secondary">Loading reviews...</Typography>
          ) : (
            <ReviewList setAverageRating={setAverageRating} reviews={reviews} />
          )}
        </Box>

        {/* Review Form */}
            {isAuthenticated && (
          <Box id="review-form" sx={{ p: 4, bgcolor: '#fff', borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 3, color: '#222' }}>
              Write Your Review
            </Typography>
                <ReviewForm
                  reviewText={reviewText}
                  handleInputChange={handleInputChange}
                  handleSubmitReview={handleSubmitReview}
                  loading={submitLoading}
                  rating={rating}
                  setRating={setRating}
                />
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ProductDetailPage;
