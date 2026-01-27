import React, { useEffect, useState } from "react";
import { cartActions } from "../redux/actions/cart.actions";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  CardMedia, 
  IconButton, 
  Divider, 
  Chip, 
  Stack,
  Paper,
  TextField,
  Badge,
  Avatar,
  Grid,
  Container,
  Alert,
  CircularProgress
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import FavoriteIcon from '@mui/icons-material/Favorite';
import emptycart from "images/empty-cart.png";
import moment from "moment";
import { enqueueSnackbar } from 'notistack';
import StripeCheckout from "react-stripe-checkout";
import api from "../redux/api";

const CartPage = () => {
  const stripeKey = process.env.REACT_APP_STRIPE;
  const [stripeToken, setStripeToken] = useState(null);
  const history = useHistory();
  const user = useSelector((state) => state.auth.user);
  let cart = useSelector((state) => state.cart.cartItems);
  const isCheckedout = useSelector((state) => state.cart.isCheckedout);
  const loading = useSelector((state) => state.cart.loading);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const [guestCart, setGuestCart] = useState([]);
  const [guestCartProducts, setGuestCartProducts] = useState([]);
  const cartError = useSelector((state) => state.cart.error);

  const removeFromCartHandler = (product) => {
    dispatch(cartActions.removeFromCart(product));
  };

  useEffect(() => {
    const makeRequest = async () => {
      try {
        dispatch(
          cartActions.checkOutCart({
            tokenId: stripeToken.id,
          })
        );
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.log(error);
        }
      }
    };
    stripeToken && !isCheckedout && makeRequest();
  }, [isCheckedout, stripeToken]);

  const checkoutHandler = () => {
    try {
      dispatch(cartActions.checkOutCart());
    } catch (error) {}
  };

  const onToken = (token) => {
    setStripeToken(token);
  };

  let totalCartRevenue = 0;
  for (let i = 0; i < cart.length; i++) {
    let item = cart[i];
    const price = item.currentPrice || item.product?.price || 0;
    totalCartRevenue += parseFloat(price) * parseInt(item?.quantity || 0);
  }

  useEffect(() => {
    if (!isAuthenticated) {
      const stored = JSON.parse(localStorage.getItem('guestCart') || '[]');
      setGuestCart(stored);
      
      // Fetch product details for guest cart items
      const fetchGuestProducts = async () => {
        try {
          const products = await Promise.all(
            stored.map(async (item) => {
              try {
                const res = await api.get(`/products/${item.productId}`);
                const product = res.data.data.product || res.data.data;
                return {
                  ...item,
                  product: product,
                  price: item.currentPrice || product.price
                };
              } catch (error) {
                if (process.env.NODE_ENV === 'development') {
                  console.error(`Error fetching product ${item.productId}:`, error);
                }
                return null;
              }
            })
          );
          setGuestCartProducts(products.filter(p => p !== null));
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Error fetching guest cart products:', error);
          }
        }
      };
      
      if (stored.length > 0) {
        fetchGuestProducts();
      } else {
        setGuestCartProducts([]);
      }
    } else {
    dispatch(cartActions.getCartItems());
    }
  }, [isAuthenticated, dispatch]);

  // Remove from guest cart
  const removeFromGuestCart = (productId) => {
    // Use Redux action instead of local state
    dispatch(cartActions.removeFromCart({ productId }));
    // Also update local state for immediate UI update
    const updated = guestCart.filter(item => item.productId !== productId);
    setGuestCart(updated);
    const updatedProducts = guestCartProducts.filter(item => item.productId !== productId);
    setGuestCartProducts(updatedProducts);
  };

  // Update guest cart quantity
  const updateGuestCartQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromGuestCart(productId);
      return;
    }
    // Use Redux action
    dispatch(cartActions.updateCartItemQuantity(productId, newQuantity));
    // Also update local state for immediate UI update
    const updated = guestCart.map(item => 
      item.productId === productId ? { ...item, quantity: newQuantity } : item
    );
    setGuestCart(updated);
    const updatedProducts = guestCartProducts.map(item => 
      item.productId === productId ? { ...item, quantity: newQuantity } : item
    );
    setGuestCartProducts(updatedProducts);
  };

  // Guest cart total
  const guestTotal = guestCartProducts.reduce((sum, item) => {
    const price = item.currentPrice || item.product?.price || item.price || 0;
    return sum + (price * item.quantity);
  }, 0);

  // Calculate tax (10% of subtotal)
  const taxRate = 0.10; // 10%
  const authenticatedSubtotal = totalCartRevenue;
  const guestSubtotal = guestTotal;
  const subtotal = isAuthenticated ? authenticatedSubtotal : guestSubtotal;
  const tax = subtotal * taxRate;
  const totalWithTax = subtotal + tax;

  // Glassmorphic style
  const glass = {
    background: 'rgba(255,255,255,0.7)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)',
    backdropFilter: 'blur(12px)',
    borderRadius: 3,
    border: '1px solid rgba(255,255,255,0.18)',
  };

  if (loading && isAuthenticated) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const isEmpty = (!isAuthenticated && guestCartProducts.length === 0) || (isAuthenticated && (cart.length === 0 || isCheckedout));

  if (isEmpty) {
  return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafb', py: 8 }}>
        <Container maxWidth="lg">
          {/* Animated Empty Cart Section */}
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            {/* Floating Cart Animation */}
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
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
                boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3)',
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
                
                <ShoppingCartOutlinedIcon sx={{ 
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
                background: '#4ecdc4',
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
                background: '#45b7d1',
                animation: 'bounce 2s infinite 1s',
                zIndex: 2
              }} />
            </Box>

            {/* Main Content */}
            <Typography variant="h3" fontWeight={800} sx={{ 
              mb: 2, 
              color: '#222',
              background: 'linear-gradient(90deg, #667eea 30%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block'
            }}>
              Your cart is empty
            </Typography>
            
            <Typography variant="h6" color="text.secondary" sx={{ mb: 6, maxWidth: 500, mx: 'auto', lineHeight: 1.6 }}>
              Looks like you haven't added any items to your cart yet. 
              <br />
              Let's find something amazing for you!
            </Typography>

            {/* Action Buttons */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center" sx={{ mb: 8 }}>
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
                startIcon={<FavoriteIcon />}
                onClick={() => history.push('/wishlist')}
                sx={{ 
                  borderRadius: 4, 
                  px: 6, 
                  py: 2, 
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  borderColor: '#667eea',
                  color: '#667eea',
                  '&:hover': { 
                    borderColor: '#764ba2',
                    color: '#764ba2',
                    bgcolor: 'rgba(102, 126, 234, 0.05)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.2)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                View Wishlist
              </Button>
            </Stack>
          </Box>

        </Container>

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
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 6, mb: 6, width: '100%', pb: { xs: 10, sm: 6 }, px: { xs: 2, sm: 0 } }}>
      <Box sx={{ maxWidth: 1300, mx: 'auto' }}>
        {/* Show error if present */}
        {cartError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {typeof cartError === 'string' ? cartError : cartError?.data?.message || 'An error occurred during checkout.'}
          </Alert>
        )}
        <Box sx={{ mt: 5, mb: 3 }}>
          <Typography variant="h4" fontWeight={700} sx={{ color: '#222', mb: 1, letterSpacing: 0 }}>
            Your Cart
          </Typography>
          <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 400, mb: 0.5 }}>
            {isAuthenticated ? cart.length : guestCartProducts.length} item{(isAuthenticated ? cart.length : guestCartProducts.length) !== 1 ? 's' : ''}
          </Typography>
          <Divider sx={{ mt: 2, mb: 3 }} />
        </Box>
        <Grid container spacing={{ xs: 2, md: 4 }}>
          {/* Cart Items */}
          <Grid item xs={12} md={8}>
            <Paper elevation={0} sx={{ ...glass, p: { xs: 3, sm: 4 } }}>
              <Typography variant="h5" fontWeight={700} sx={{ mb: 3, color: '#222' }}>
                Cart Items ({isAuthenticated ? cart.length : guestCartProducts.length})
              </Typography>
              
              <Stack spacing={3}>
                {isAuthenticated ? cart.map((item) => (
                  <Card key={item.product?._id} elevation={0} sx={{ bgcolor: 'rgba(255,255,255,0.5)', borderRadius: 3 }}>
                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                      <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: '120px 1fr 120px' },
                        alignItems: 'center',
                        gap: { xs: 2, sm: 3 }
                      }}>
                        <CardMedia
                          component="img"
                          image={item.product?.image}
                          alt={item.product?.name}
                          sx={{ 
                            height: 100, 
                            width: '100%', 
                            objectFit: 'contain',
                            borderRadius: 2,
                            bgcolor: '#f8fafb'
                          }}
                        />
                        <Box>
                          <Typography variant="h6" fontWeight={600} sx={{ mb: 1, color: '#222' }}>
                            {item.product?.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {item.product?.description}
                          </Typography>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <IconButton 
                              size="small" 
                              onClick={() => dispatch(cartActions.updateCartItemQuantity(item.product._id, item.quantity - 1))}
                              disabled={item.quantity <= 1}
                            >
                              <RemoveIcon />
                            </IconButton>
                            <Typography variant="body1" fontWeight={600}>
                              {item.quantity}
                            </Typography>
                            <IconButton 
                              size="small" 
                              onClick={() => dispatch(cartActions.updateCartItemQuantity(item.product._id, item.quantity + 1))}
                            >
                              <AddIcon />
                            </IconButton>
                          </Stack>
                        </Box>
                        <Box sx={{ 
                          display: 'flex',
                          flexDirection: { xs: 'row', sm: 'column' },
                          alignItems: { xs: 'center', sm: 'flex-end' },
                          justifyContent: { xs: 'space-between', sm: 'center' },
                          minHeight: { xs: 'auto', sm: 100 },
                          mt: { xs: 1, sm: 0 }
                        }}>
                          <Typography variant="h6" fontWeight={700} color="primary">
                            ${((item.currentPrice || item.product?.price || 0) * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </Typography>
                          <IconButton 
                            color="error" 
                            onClick={() => removeFromCartHandler(item.product)}
                            sx={{ bgcolor: 'rgba(244,67,54,0.1)', mt: { xs: 0, sm: 2 } }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                )) : guestCartProducts.map((item) => {
                  if (!item.product) return null;
                  const price = item.currentPrice || item.product.price || 0;
                  return (
                    <Card key={item.productId || item.product._id} elevation={0} sx={{ bgcolor: 'rgba(255,255,255,0.5)', borderRadius: 3 }}>
                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                        <Box sx={{
                          display: 'grid',
                          gridTemplateColumns: { xs: '1fr', sm: '120px 1fr 120px' },
                          alignItems: 'center',
                        gap: { xs: 2, sm: 3 }
                        }}>
                          <CardMedia
                            component="img"
                            image={item.product.image}
                            alt={item.product.name}
                            sx={{ 
                              height: 100, 
                              width: '100%', 
                              objectFit: 'contain',
                              borderRadius: 2,
                              bgcolor: '#f8fafb'
                            }}
                          />
                          <Box>
                            <Typography variant="h6" fontWeight={600} sx={{ mb: 1, color: '#222' }}>
                              {item.product.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              {item.product.description}
                            </Typography>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <IconButton 
                                size="small" 
                                onClick={() => updateGuestCartQuantity(item.productId, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                <RemoveIcon />
                              </IconButton>
                              <Typography variant="body1" fontWeight={600}>
                                {item.quantity}
                              </Typography>
                              <IconButton 
                                size="small" 
                                onClick={() => updateGuestCartQuantity(item.productId, item.quantity + 1)}
                              >
                                <AddIcon />
                              </IconButton>
                            </Stack>
                          </Box>
                          <Box sx={{ 
                            display: 'flex',
                            flexDirection: { xs: 'row', sm: 'column' },
                            alignItems: { xs: 'center', sm: 'flex-end' },
                            justifyContent: { xs: 'space-between', sm: 'center' },
                            minHeight: { xs: 'auto', sm: 100 },
                            mt: { xs: 1, sm: 0 }
                          }}>
                            <Typography variant="h6" fontWeight={700} color="primary">
                              ${(price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </Typography>
                            <IconButton 
                              color="error" 
                              onClick={() => removeFromGuestCart(item.productId)}
                              sx={{ bgcolor: 'rgba(244,67,54,0.1)', mt: { xs: 0, sm: 2 } }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  );
                })}
              </Stack>
            </Paper>
          </Grid>

          {/* Order Summary */}
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ ...glass, p: { xs: 3, sm: 4 }, position: { xs: 'static', md: 'sticky' }, top: { md: 20 } }}>
              <Typography variant="h5" fontWeight={700} sx={{ mb: 3, color: '#222' }}>
                Order Summary
              </Typography>
              
              <Stack spacing={2} sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1">Subtotal</Typography>
                  <Typography variant="body1" fontWeight={600}>
                    ${isAuthenticated ? totalCartRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : guestTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1">Shipping</Typography>
                  <Typography variant="body1" fontWeight={600} color="success.main">
                    Free
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1">Tax (10%)</Typography>
                  <Typography variant="body1" fontWeight={600}>
                    ${tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" fontWeight={700}>Total</Typography>
                  <Typography variant="h6" fontWeight={700} color="primary">
                    ${totalWithTax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Typography>
                </Box>
              </Stack>

              {isAuthenticated ? (
                            <StripeCheckout
                              name="ShopNow"
                              billingAddress
                              shippingAddress
                              description={`Your total is $${totalWithTax.toFixed(2)}`}
                              amount={Math.round(totalWithTax * 100)}
                              token={onToken}
                              stripeKey={stripeKey}
                              onClick={() => checkoutHandler()}
                            >
                  <Button 
                    variant="contained" 
                    fullWidth 
                    size="large"
                    startIcon={<PaymentIcon />}
                    sx={{ 
                      borderRadius: 3, 
                      py: 1.5, 
                      bgcolor: '#00bfae', 
                      '&:hover': { bgcolor: '#43e6c2' } 
                    }}
                  >
                    Proceed to Checkout
                  </Button>
                            </StripeCheckout>
              ) : (
                <Button 
                  variant="contained" 
                  fullWidth 
                  size="large"
                  startIcon={<PaymentIcon />}
                  onClick={() => enqueueSnackbar('Please log in to check out!', { variant: 'error' })}
                  sx={{ 
                    borderRadius: 3, 
                    py: 1.5, 
                    bgcolor: '#00bfae', 
                    '&:hover': { bgcolor: '#43e6c2' } 
                  }}
                >
                  Proceed to Checkout
                </Button>
              )}

              <Alert severity="info" sx={{ mt: 3, borderRadius: 2 }}>
                <Typography variant="body2">
                  Expected delivery: {moment().add(3, "days").format("MMM DD, YYYY")}
                </Typography>
              </Alert>

              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  We accept:
                </Typography>
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                  <Chip icon={<CreditCardIcon />} label="Visa" size="small" />
                  <Chip icon={<CreditCardIcon />} label="Mastercard" size="small" />
                  <Chip icon={<CreditCardIcon />} label="PayPal" size="small" />
                </Stack>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default CartPage;
