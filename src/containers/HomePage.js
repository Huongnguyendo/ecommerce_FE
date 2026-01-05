import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { productActions } from "redux/actions";
import { useHistory, useLocation } from "react-router-dom";
import ProductCard from "components/ProductCard";
import PaginationBar from "../components/PaginationBar";
import logoImg from "../images/shopnow.png";
import iphoneimg from "../images/iphone-17.png";
import fashion from "../images/dress.png";
import phone from "../images/smartphone.png";
import tv from "../images/smart-tv.png";
import accessories from "../images/eyeglasses.png";
import health from "../images/healthcare.png";
import house from "../images/house.png";
import household from "../images/household.png";
import book from "../images/open-book.png";
// MUI imports
import {
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Avatar,
  Container,
  Box,
  Grid,
  Typography,
  Button,
  Paper,
  CircularProgress,
  useTheme,
  Chip,
  Stack,
} from "@mui/material";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { keyframes } from '@mui/system';
import CategoryIcon from '@mui/icons-material/Category';
import AppsIcon from '@mui/icons-material/Apps';
import RecommendIcon from '@mui/icons-material/Recommend';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import VisibilityIcon from '@mui/icons-material/Visibility';
import api from "redux/api";

const categories = [
  { label: "Fashion", img: fashion },
  { label: "Phones and Accessories", img: phone },
  { label: "Electronic device", img: tv },
  { label: "Household goods", img: house },
  { label: "Home and Life", img: household },
  { label: "Health and Life", img: health },
  { label: "Fashion Accessories", img: accessories },
  { label: "Books", img: book },
];

// Floating animation keyframes
const float = keyframes`
  0% { transform: translateY(0px) rotate(-8deg); }
  50% { transform: translateY(-18px) rotate(-8deg); }
  100% { transform: translateY(0px) rotate(-8deg); }
`;

const HomePage = () => {
  const history = useHistory();
  const location = useLocation();
  const [pageNum, setPageNum] = useState(1);
  const totalPageNum = useSelector((state) => state.product.totalPageNum);
  const loading = useSelector((state) => state.product.loading);
  const [category, setCategory] = useState("");
  const productList = useSelector((state) => state.product.products);
  const recommendations = useSelector((state) => state.product.recommendations);
  const dispatch = useDispatch();
  const theme = useTheme();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // Hero carousel for static images
  const heroSlides = ['/images/hero-1.png', '/images/hero-2.png'];
  const [heroIndex, setHeroIndex] = useState(0);
  const nextHero = () => setHeroIndex((i) => (i + 1) % heroSlides.length);
  const prevHero = () => setHeroIndex((i) => (i - 1 + heroSlides.length) % heroSlides.length);
  useEffect(() => {
    const id = setInterval(nextHero, 6000);
    return () => clearInterval(id);
  }, []);

  // recent sections
  const [recentViews, setRecentViews] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [todaysDeals, setTodaysDeals] = useState([]);
  const [dealsLoading, setDealsLoading] = useState(false);
  const [dealsStart, setDealsStart] = useState(0);
  const [dealsPageSize] = useState(4);

  // recommendation pager (4 per page)
  const [recStart, setRecStart] = useState(0);
  const recPageSize = 4;
  const safeRecs = (recommendations || []).filter(p => !p?.isDeleted);
  const totalRecs = safeRecs.length;
  const canPrevRec = recStart > 0;
  const canNextRec = recStart + recPageSize < totalRecs;
  const visibleRecs = safeRecs.slice(recStart, recStart + recPageSize);

  // Today's Deals pagination
  const visibleDeals = todaysDeals.slice(dealsStart, dealsStart + dealsPageSize);
  const totalDeals = todaysDeals.length;
  const canPrevDeals = dealsStart > 0;
  const canNextDeals = dealsStart + dealsPageSize < totalDeals;

  // Recently Viewed pagination
  const [recentStart, setRecentStart] = useState(0);
  const recentPageSize = 4;
  const visibleRecentViews = recentViews.slice(recentStart, recentStart + recentPageSize);
  const totalRecentViews = recentViews.length;
  const canPrevRecent = recentStart > 0;
  const canNextRecent = recentStart + recentPageSize < totalRecentViews;

  useEffect(() => {
    // reset pager when data changes
    setRecStart(0);
  }, [totalRecs]);

  // Get search param from URL
  const urlSearch = new URLSearchParams(location.search).get("search") || "";

  const gotoProductDetail = (index) => {
    // console.log("ind ", index); ???
    history.push(`/products/${index}`);
  };


  // Fetch Today's Deals with fallback to popular products
  const fetchTodaysDeals = async () => {
    setDealsLoading(true);
    try {
      const res = await api.get('/products/deals');
      const deals = res.data?.data?.products || res.data?.products || [];
      
      // If no deals available, show popular products as fallback
      if (deals.length === 0) {
        // Fetch popular products (in stock, non-deleted)
        try {
          const popularRes = await api.get('/products?limit=8');
          const popularProducts = popularRes.data?.data?.products || popularRes.data?.products || [];
          // Filter for in-stock, non-deleted products, prioritize by rating
          const availableProducts = popularProducts
            .filter(p => !p.isDeleted && (p.inStockNum || 0) > 0)
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, 4);
          setTodaysDeals(availableProducts);
        } catch (fallbackError) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Error fetching fallback products:', fallbackError);
          }
          setTodaysDeals([]);
        }
      } else {
        setTodaysDeals(deals);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching today\'s deals:', error);
      }
      // Try fallback on error too
      try {
        const popularRes = await api.get('/products?limit=8');
        const popularProducts = popularRes.data?.data?.products || popularRes.data?.products || [];
        const availableProducts = popularProducts
          .filter(p => !p.isDeleted && (p.inStockNum || 0) > 0)
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 4);
        setTodaysDeals(availableProducts);
      } catch (fallbackError) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error fetching fallback products:', fallbackError);
        }
        setTodaysDeals([]);
      }
    } finally {
      setDealsLoading(false);
    }
  };

  const handleViewAllProducts = () => {
    if (history.location.pathname !== '/' || location.search) {
      history.push('/');
      setTimeout(() => {
        const productSection = document.getElementById('homePageProduct');
        if (productSection) {
          productSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const productSection = document.getElementById('homePageProduct');
      if (productSection) {
        productSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleCategoryClick = (catLabel) => {
    if (location.search) {
      history.replace('/');
    }
    // Toggle: if clicking the same category, clear filter (show all)
    if (category === catLabel) {
      setCategory("");
    } else {
      setCategory(catLabel);
    }
    // Scroll to product section
    setTimeout(() => {
      const productSection = document.getElementById('homePageProduct');
      if (productSection) {
        productSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };


  useEffect(() => {
    if (urlSearch) {
      dispatch(productActions.searchProductsByKeyword(urlSearch, pageNum, 12));
      // Scroll to product section when searching
      const productSection = document.getElementById('homePageProduct');
      if (productSection) {
        productSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      dispatch(productActions.getProductList(category, pageNum, 12));
    }
  }, [dispatch, urlSearch, pageNum, category]);


  // Fetch recommendations and deals on component mount and when user changes
  useEffect(() => {
    dispatch(productActions.getRecommendations());
    fetchTodaysDeals();
  }, [dispatch, isAuthenticated]); // Removed location.pathname to prevent unnecessary re-renders

  // Fetch recent sections when logged in
  useEffect(() => {
    let cancel = false;
    async function fetchRecent() {
      if (!isAuthenticated) { setRecentViews([]); setRecentSearches([]); return; }
      try {
        const [viewsRes, searchRes] = await Promise.all([
          api.get('/users/me/recent-views'),
          api.get('/users/me/recent-searches'),
        ]);
        if (!cancel) {
          setRecentViews((viewsRes.data?.data || []).filter(p => !p?.isDeleted));
          setRecentSearches(searchRes.data?.data || []);
        }
      } catch (e) {
        if (!cancel) { setRecentViews([]); setRecentSearches([]); }
      }
    }
    fetchRecent();
    return () => { cancel = true; };
  }, [isAuthenticated]);

  // Glassmorphic style helper
  const glass = {
    background: 'rgba(255,255,255,0.7)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)',
    backdropFilter: 'blur(12px)',
    borderRadius: 6,
    border: '1px solid rgba(255,255,255,0.18)',
  };

  return (
    <Box sx={{ bgcolor: 'linear-gradient(135deg, #e0e7ef 0%, #f5f7fa 100%)', minHeight: '100vh' }}>
      {/* Removed the nitec. header/navbar. The hero section starts below the main ShopNow navbar. */}
      <Container maxWidth="lg" sx={{ mt: 6, mb: 6, position: 'relative' }}>
        {/* Floating shapes */}
        <Box sx={{
          position: 'absolute',
          top: { xs: 20, md: -40 },
          left: { xs: -30, md: -80 },
          width: 180,
          height: 180,
          bgcolor: 'primary.main',
          opacity: 0.15,
          borderRadius: '50%',
          filter: 'blur(30px)',
          zIndex: 1,
        }} />
        <Box sx={{
          position: 'absolute',
          bottom: { xs: 10, md: -40 },
          right: { xs: -30, md: -80 },
          width: 140,
          height: 140,
          bgcolor: 'secondary.main',
          opacity: 0.18,
          borderRadius: '50%',
          filter: 'blur(24px)',
          zIndex: 1,
        }} />
        <Box sx={{
          position: 'absolute',
          top: { xs: 80, md: 60 },
          right: { xs: 10, md: 200 },
          width: 60,
          height: 60,
          bgcolor: '#00C853',
          opacity: 0.12,
          borderRadius: '50%',
          filter: 'blur(12px)',
          zIndex: 1,
        }} />
        {/* Reverted Hero Section */}
        <Paper
          elevation={0}
          sx={{
            ...glass,
            p: { xs: 3, md: 6 },
            borderRadius: 6,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #e0e7ef 0%, #b2fefa 100%)',
            zIndex: 2,
          }}
        >
          {/* Left: Headline and CTA */}
          <Box sx={{ flex: 1, pr: { md: 6 }, mb: { xs: 4, md: 0 }, zIndex: 2 }}>
            <Typography variant="h2" fontWeight={800} sx={{ mb: 2, lineHeight: 1.1 }}>
              HOT ITEM THIS WEEK
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: '#00C853',
                color: '#fff',
                borderRadius: 8,
                px: 4,
                py: 1.5,
                fontWeight: 700,
                fontSize: 18,
                boxShadow: '0 4px 24px 0 rgba(0,200,83,0.10)',
                '&:hover': { bgcolor: '#009624' },
              }}
              onClick={handleViewAllProducts}
              endIcon={<Box component="span" sx={{ fontSize: 22, ml: 1 }}>→</Box>}
            >
              View All Products
            </Button>
          </Box>
          {/* Right: Product Image */}
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, position: 'relative' }}>
            {/* Vibrant glow behind the image */}
            <Box
              sx={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                height: 400,
                bgcolor: '#1976d2',
                opacity: 0.35,
                borderRadius: '50%',
                filter: 'blur(60px)',
                zIndex: 1,
              }}
            />
            <Box
              component="img"
              src={iphoneimg}
              alt="Hot Item"
              sx={{
                maxWidth: 340,
                width: '100%',
                borderRadius: 4,
                position: 'relative',
                zIndex: 2,
              }}
            />
          </Box>
        </Paper>
      </Container>

      {/* Category Section */}
      <Container maxWidth="lg" sx={{ mt: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CategoryIcon sx={{ fontSize: 20, color: 'primary.main', mr: 1 }} />
          <Typography
            variant="h5"
            fontWeight={700}
            sx={{
              background: 'linear-gradient(90deg, #1976d2 30%, #00bfae 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block',
              letterSpacing: 1,
            }}
          >
            CATEGORY
          </Typography>
        </Box>
        <Grid container spacing={3} justifyContent="flex-start">
          {/* "All" category option */}
          <Grid item xs={6} sm={4} md={3}>
            <Paper
              elevation={2}
              sx={{
                p: 1,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 },
                width: { xs: '100%', sm: 90, md: 100 },
                minWidth: 80,
                maxWidth: 110,
                height: 100,
                mx: 'auto',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: category === "" ? 'rgba(25, 118, 210, 0.08)' : 'background.paper',
                border: category === "" ? '2px solid' : '2px solid transparent',
                borderColor: category === "" ? 'primary.main' : 'transparent',
                position: 'relative',
              }}
              onClick={() => setCategory("")}
            >
              {category === "" && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      color: 'white',
                      fontSize: 12,
                      fontWeight: 'bold',
                    }}
                  >
                    ✓
                  </Box>
                </Box>
              )}
              <AppsIcon sx={{ fontSize: 28, mb: 0.5, color: category === "" ? 'primary.main' : 'text.secondary' }} />
              <Typography variant="caption" fontWeight={category === "" ? 600 : 400} color={category === "" ? 'primary.main' : 'text.primary'}>
                All Products
              </Typography>
            </Paper>
          </Grid>
          
          {/* Regular categories */}
          {categories.map((cat) => (
            <Grid item xs={6} sm={4} md={3} key={cat.label}>
              <Paper
                elevation={2}
                sx={{
                  p: 1,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 },
                  width: { xs: '100%', sm: 90, md: 100 },
                  minWidth: 80,
                  maxWidth: 110,
                  height: 100,
                  mx: 'auto',
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: category === cat.label ? 'rgba(25, 118, 210, 0.08)' : 'background.paper',
                  border: category === cat.label ? '2px solid' : '2px solid transparent',
                  borderColor: category === cat.label ? 'primary.main' : 'transparent',
                  position: 'relative',
                }}
                onClick={() => handleCategoryClick(cat.label)}
              >
                {category === cat.label && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        color: 'white',
                        fontSize: 12,
                        fontWeight: 'bold',
                      }}
                    >
                      ✓
                    </Box>
                  </Box>
                )}
                <Box
                  component="img"
                  src={cat.img}
                  alt={cat.label}
                  sx={{ 
                    height: 28, 
                    mb: 0.5,
                  }}
                />
                <Typography variant="caption" fontWeight={category === cat.label ? 600 : 400} color={category === cat.label ? 'primary.main' : 'text.primary'}>
                  {cat.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Recommendations Section - always show container; content branches by auth/data */}
      <Container maxWidth="lg" sx={{ mt: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <RecommendIcon sx={{ fontSize: 20, color: '#00C853', mr: 1 }} />
            <Typography
              variant="h5"
              fontWeight={700}
              sx={{
                background: 'linear-gradient(90deg, #00C853 30%, #1976d2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block',
                letterSpacing: 1,
              }}
            >
              RECOMMENDED FOR YOU
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton size="small" onClick={() => setRecStart(Math.max(0, recStart - recPageSize))} disabled={!canPrevRec} sx={{ border: '1px solid #ddd' }}>
              <ChevronLeftIcon />
            </IconButton>
            <IconButton size="small" onClick={() => setRecStart(canNextRec ? recStart + recPageSize : recStart)} disabled={!canNextRec} sx={{ border: '1px solid #ddd' }}>
              <ChevronRightIcon />
            </IconButton>
          </Box>
        </Box>

        {totalRecs > 0 ? (
          <Grid container spacing={4} justifyContent="flex-start">
            {visibleRecs.map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product._id}>
                <ProductCard product={product} gotoProductDetail={gotoProductDetail} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper elevation={0} sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              {isAuthenticated 
                ? "We're learning your preferences. Browse and buy to get recommendations."
                : "Log in to see personalized recommendations. For now, here are trending items."
              }
            </Typography>
          </Paper>
        )}
      </Container>

      {/* Today's Deals Section */}
      <Container maxWidth="lg" sx={{ mt: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LocalOfferIcon sx={{ fontSize: 20, color: '#f44336', mr: 1 }} />
            <Typography
              variant="h5"
              fontWeight={700}
              sx={{
                background: 'linear-gradient(90deg, #f44336 30%, #ff9800 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block',
                letterSpacing: 1,
              }}
            >
              TODAY'S DEALS
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton size="small" onClick={() => setDealsStart(Math.max(0, dealsStart - dealsPageSize))} disabled={!canPrevDeals} sx={{ border: '1px solid #ddd' }}>
              <ChevronLeftIcon />
            </IconButton>
            <IconButton size="small" onClick={() => setDealsStart(canNextDeals ? dealsStart + dealsPageSize : dealsStart)} disabled={!canNextDeals} sx={{ border: '1px solid #ddd' }}>
              <ChevronRightIcon />
            </IconButton>
          </Box>
        </Box>
        
        {dealsLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
            <CircularProgress size={60} />
          </Box>
        ) : totalDeals > 0 ? (
          <Grid container spacing={4} justifyContent="flex-start">
            {visibleDeals.map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product._id}>
                <ProductCard product={product} gotoProductDetail={gotoProductDetail} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper elevation={0} sx={{ p: 4, textAlign: 'center', bgcolor: 'background.paper' }}>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              No special deals available right now.
            </Typography>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => {
                setCategory('');
                history.push('/');
              }}
            >
              Browse All Products
            </Button>
          </Paper>
        )}
      </Container>

      {/* Recently Viewed moved above Products */}
      {isAuthenticated && (
        <Container maxWidth="lg" sx={{ mt: 8 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <VisibilityIcon sx={{ fontSize: 20, color: '#2196f3', mr: 1 }} />
              <Typography
                variant="h5"
                fontWeight={700}
                sx={{
                  background: 'linear-gradient(90deg, #2196f3 30%, #21cbf3 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'inline-block',
                  letterSpacing: 1,
                }}
              >
                RECENTLY VIEWED
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton size="small" onClick={() => setRecentStart(Math.max(0, recentStart - recentPageSize))} disabled={!canPrevRecent} sx={{ border: '1px solid #ddd' }}>
                <ChevronLeftIcon />
              </IconButton>
              <IconButton size="small" onClick={() => setRecentStart(canNextRecent ? recentStart + recentPageSize : recentStart)} disabled={!canNextRecent} sx={{ border: '1px solid #ddd' }}>
                <ChevronRightIcon />
              </IconButton>
            </Box>
          </Box>
          {totalRecentViews > 0 ? (
            <Grid container spacing={4} justifyContent="flex-start">
              {visibleRecentViews.map((product) => (
                <Grid item xs={12} sm={6} md={3} key={product._id}>
                  <ProductCard product={product} gotoProductDetail={gotoProductDetail} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Paper elevation={0} sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">Browse products to see your recent items here.</Typography>
            </Paper>
          )}
        </Container>
      )}

      {/* Product Section */}
      <Container maxWidth="lg" sx={{ mt: 8 }} id="homePageProduct">
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AppsIcon sx={{ fontSize: 20, color: 'secondary.main', mr: 1 }} />
          <Typography
            variant="h5"
            fontWeight={700}
            sx={{
              background: 'linear-gradient(90deg, #00bfae 30%, #1976d2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block',
              letterSpacing: 1,
            }}
          >
            PRODUCTS
          </Typography>
        </Box>
              {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
            <CircularProgress size={60} />
          </Box>
        ) : urlSearch && urlSearch.trim() !== '' && Array.isArray(productList) && productList.length === 0 && !loading ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            {/* Empty Search Icon */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ 
                width: 120, 
                height: 120, 
                borderRadius: '50%', 
                bgcolor: '#f0f2f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3
              }}>
                <SearchIcon sx={{ fontSize: 50, color: '#b0b8c1' }} />
              </Box>
              <Typography variant="h4" fontWeight={600} sx={{ mb: 2, color: '#222' }}>
                No results found for "{urlSearch}"
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
                We couldn't find any products matching your search. Try different keywords or browse our categories below.
              </Typography>
              
              {/* Clear Search Button */}
              <Button 
                variant="outlined" 
                onClick={() => history.push('/')}
                sx={{ 
                  mb: 4,
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                  fontWeight: 600
                }}
              >
                Browse All Products
              </Button>
            </Box>
            
            {/* Search Tips */}
            <Paper elevation={0} sx={{ bgcolor: '#f8fafb', p: 3, mb: 4, borderRadius: 3, maxWidth: 600, mx: 'auto' }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: '#222' }}>Search Tips</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, alignItems: 'flex-start', textAlign: 'left' }}>
                <Typography variant="body2" color="text.secondary">
                  • Check your spelling and try again
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Use more general terms (e.g., "phone" instead of "iPhone 15 Pro Max")
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Try fewer keywords
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Browse categories below to discover products
                </Typography>
              </Box>
            </Paper>

            {/* Browse Categories */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 3, color: '#222' }}>
                Browse by Category
              </Typography>
              <Grid container spacing={3} justifyContent="center">
                {categories.slice(0, 4).map((cat) => (
                  <Grid item xs={6} sm={4} md={3} key={cat.label}>
                    <Paper
                      elevation={2}
                      sx={{
                        p: 1,
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': { 
                          transform: 'translateY(-4px)', 
                          boxShadow: 4,
                        },
                        width: { xs: '100%', sm: 90, md: 100 },
                        minWidth: 80,
                        maxWidth: 110,
                        height: 100,
                        mx: 'auto',
                        boxSizing: 'border-box',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'background.paper',
                        border: '2px solid transparent',
                        borderRadius: 2
                      }}
                      onClick={() => {
                        // Clear search and show category products
                        history.push('/');
                        setTimeout(() => handleCategoryClick(cat.label), 100);
                      }}
                    >
                      <Box
                        component="img"
                        src={cat.img}
                        alt={cat.label}
                        sx={{ 
                          height: 28, 
                          mb: 0.5,
                        }}
                      />
                      <Typography variant="caption" fontWeight={400}>
                        {cat.label}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Show Popular Products as Alternatives */}
            {(todaysDeals.length > 0 || (recommendations && recommendations.length > 0)) && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 3, color: '#222' }}>
                  You might be interested in:
                </Typography>
                <Grid container spacing={3} justifyContent="flex-start">
                  {(todaysDeals.length > 0 ? todaysDeals : recommendations || [])
                    .filter(p => p && !p.isDeleted)
                    .slice(0, 4)
                    .map((product) => (
                    <Grid item xs={12} sm={6} md={3} key={product._id}>
                      <ProductCard product={product} gotoProductDetail={gotoProductDetail} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Box>
        ) : productList && productList.length > 0 ? (
          <Grid container spacing={4} justifyContent="flex-start">
            {productList.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                <ProductCard product={product} gotoProductDetail={gotoProductDetail} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="body1" color="text.secondary">
              No products found. Try selecting a different category.
            </Typography>
          </Box>
        )}
        <Box sx={{ mt: 4 }}>
            <PaginationBar
              pageNum={pageNum}
              setPageNum={setPageNum}
              totalPageNum={totalPageNum}
              loading={loading}
            />
        </Box>
      </Container>

      {/* Support Section */}
      <Box sx={{ bgcolor: 'grey.100', py: 6, mt: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                <LocalShippingIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6">FREE SHIPPING</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                <AccessTimeIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6">30 DAYS MONEY BACK</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                <SupportAgentIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6">SUPPORT 24/7</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer Section */}
      <Box sx={{
        bgcolor: 'rgba(25, 34, 51, 0.95)',
        color: '#fff',
        py: { xs: 6, md: 8 },
        mt: 8,
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        backdropFilter: 'blur(8px)',
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center" alignItems="flex-start">
            <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-start' }, mb: 2 }}>
                <Box component="img" src={logoImg} alt="ShopNow Logo" sx={{ height: 40, width: 40, borderRadius: 2, mr: 2, bgcolor: '#fff', p: 0.5 }} />
                <Typography variant="h6" fontWeight={800} sx={{ letterSpacing: 1, color: '#00bfae' }}>ShopNow</Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'grey.300', mb: 2 }}>
                Discover the latest trends and best deals. Shop smarter, live better.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' }, mt: 2 }}>
                <IconButton color="inherit" size="small" href="#" sx={{ bgcolor: 'rgba(0,191,174,0.12)' }}><i className="fab fa-facebook-f"></i></IconButton>
                <IconButton color="inherit" size="small" href="#" sx={{ bgcolor: 'rgba(0,191,174,0.12)' }}><i className="fab fa-twitter"></i></IconButton>
                <IconButton color="inherit" size="small" href="#" sx={{ bgcolor: 'rgba(0,191,174,0.12)' }}><i className="fab fa-instagram"></i></IconButton>
                <IconButton color="inherit" size="small" href="#" sx={{ bgcolor: 'rgba(0,191,174,0.12)' }}><i className="fab fa-linkedin-in"></i></IconButton>
              </Box>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>Quick Links</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: { xs: 'center', md: 'flex-start' } }}>
                <Button color="inherit" href="/" sx={{ textTransform: 'none', color: 'grey.100', fontWeight: 500 }}>Home</Button>
                <Button color="inherit" href="/cart" sx={{ textTransform: 'none', color: 'grey.100', fontWeight: 500 }}>Cart</Button>
                <Button color="inherit" href="/wishlist" sx={{ textTransform: 'none', color: 'grey.100', fontWeight: 500 }}>Wishlist</Button>
                <Button color="inherit" href="/privacy" sx={{ textTransform: 'none', color: 'grey.100', fontWeight: 500 }}>Privacy Policy</Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>Contact</Typography>
              <Box display="flex" alignItems="center" justifyContent={{ xs: 'center', md: 'flex-start' }} mb={1}>
                <PhoneIcon sx={{ mr: 1, color: '#00bfae' }} />
                <Typography variant="body2">0123-456-789</Typography>
              </Box>
              <Box display="flex" alignItems="center" justifyContent={{ xs: 'center', md: 'flex-start' }}>
                <EmailIcon sx={{ mr: 1, color: '#00bfae' }} />
                <Typography variant="body2">support@shopnow.com</Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'grey.400', mt: 2 }}>
                &copy; {new Date().getFullYear()} ShopNow. All rights reserved.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
