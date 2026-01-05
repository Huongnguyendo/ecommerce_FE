<<<<<<< HEAD
import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { productActions } from "../../../../redux/actions/product.actions";
import { extractCategoryName, toNumber, toString, formatPrice } from "../../../../utils/dataTransformers";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Grid, Card, CardContent, Typography, Box, Paper, useTheme, Container } from "@mui/material";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip as ChartTooltip, Legend } from 'chart.js';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import StarIcon from '@mui/icons-material/Star';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import moment from "moment";
import Tooltip from '@mui/material/Tooltip';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LogoutIcon from '@mui/icons-material/Logout';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import FeedbackIcon from '@mui/icons-material/Feedback';
import HistoryIcon from '@mui/icons-material/History';
import { authActions } from "../../../../redux/actions/auth.actions";
import { tokens } from '../../../../theme';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, ChartTooltip, Legend);

const glassStyle = {
  background: 'rgba(36, 37, 42, 0.7)',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  backdropFilter: 'blur(8px)',
  borderRadius: '18px',
  border: '1px solid rgba(255,255,255,0.12)',
  color: '#fff',
};

// Add a special style for chart cards
const chartGlassStyle = {
  background: 'rgba(36, 37, 42, 0.45)',
  boxShadow: '0 4px 24px 0 rgba(31, 38, 135, 0.18)',
  backdropFilter: 'blur(6px)',
  borderRadius: '18px',
  border: '1px solid rgba(255,255,255,0.08)',
  color: '#fff',
};

// Add a special style for compact stat cards
const compactStatStyle = {
  background: 'rgba(36, 37, 42, 0.28)',
  boxShadow: '0 2px 12px 0 rgba(31, 38, 135, 0.10)',
  borderRadius: '16px',
  border: '1px solid rgba(255,255,255,0.10)',
  color: '#fff',
  minHeight: 70,
  p: 1.5,
  display: 'flex',
  alignItems: 'center',
  mb: 0,
};

// Add a special style for the product table card
const productTableCardStyle = {
  background: 'rgba(36, 37, 42, 0.22)',
  boxShadow: '0 2px 12px 0 rgba(31, 38, 135, 0.10)',
  borderRadius: '20px',
  border: '1px solid rgba(255,255,255,0.10)',
  color: '#fff',
  p: 3,
  mt: 7,
  mb: 4,
  maxWidth: 1050,
  mx: 'auto',
};

// Add a special style for the premium product table card
const premiumTableCardStyle = {
  background: 'rgba(255,255,255,0.75)',
  boxShadow: '0 8px 32px 0 rgba(31,38,135,0.10)',
  borderRadius: '28px',
  border: '1px solid rgba(0,0,0,0.06)',
  color: '#222',
  p: 4,
  mt: 10,
  mb: 8,
  maxWidth: 950,
  mx: 'auto',
  backdropFilter: 'blur(12px)',
};

// Color palette using theme tokens to match admin dashboard
const darkBg = tokens.background.main; // '#1f2026'
const sidebarBg = tokens.background.light; // '#2d2d34'
const cardBg = tokens.background.light; // '#2d2d34'
const cardShadow = '0 2px 12px 0 rgba(0,0,0,0.18)';
const accent = tokens.primary[500]; // '#12efc8' - teal to match admin
const accent2 = tokens.primary[400]; // '#41f2d3' - lighter teal
const textPrimary = tokens.grey[100]; // '#f0f0f3'
const textSecondary = tokens.grey[300]; // '#d1d3da'
const statCardBg = tokens.background.light; // '#2d2d34'
const statCardShadow = '0 1.5px 8px 0 rgba(0,0,0,0.18)';

const sidebarLinks = [
  { label: 'Analytics', icon: <BarChartIcon />, path: '/seller/products' },
  { label: 'Add Product', icon: <AddCircleOutlineIcon />, path: '/seller/products/add' },
  { label: 'History', icon: <HistoryIcon />, path: '/seller/history' },
  { divider: true },
  { label: 'Log out', icon: <LogoutIcon />, path: '/logout' },
];

const SellerDashboard = () => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const products = useSelector((state) => state.product?.products) || [];
  const loading = useSelector((state) => state.product?.loading);
  const sellingHistory = useSelector((state) => state.product.historyToRender) || [];
  const user = useSelector((state) => state.auth?.user) || {};

  useEffect(() => {
    dispatch(productActions.getAllProductsForSeller());
    dispatch(productActions.getHistoryForSeller());
  }, [dispatch]);

  // --- Compute Stats ---
  const totalProducts = products.length;
  let totalSales = 0;
  let totalRevenue = 0;
  let productSalesMap = {};
  const uniqueBuyers = new Set();

  sellingHistory.forEach(item => {
    item.history.forEach(h => {
      const quantity = h.quantity || 0;
      const price = h.price || 0;
      totalSales += quantity;
      totalRevenue += quantity * price;
      if (!productSalesMap[item.product._id]) {
        productSalesMap[item.product._id] = {
          ...item.product,
          sales: 0,
          revenue: 0,
        };
      }
      productSalesMap[item.product._id].sales += quantity;
      productSalesMap[item.product._id].revenue += quantity * price;
      if (h.buyer && h.buyer._id) {
        uniqueBuyers.add(h.buyer._id);
      }
    });
  });
  const totalCustomers = uniqueBuyers.size;

  // Merge current product data (including isDeleted status) with sales data
  const productsById = {};
  products.forEach(prod => {
    productsById[prod._id] = prod;
  });

  // Update productSalesMap with current product data
  Object.keys(productSalesMap).forEach(productId => {
    if (productsById[productId]) {
      // Product exists in current products list - merge with latest data
      productSalesMap[productId] = {
        ...productSalesMap[productId],
        ...productsById[productId],
      };
    } else {
      // Product not in current products list - it's likely deleted
      // (because getAllProductsForSeller filters out deleted products)
      productSalesMap[productId].isDeleted = true;
    }
  });

  // Top products by sales (include all products, including deleted ones)
  const topProducts = Object.values(productSalesMap)
    .filter((p) => {
      // Only filter out products with no stock, but include deleted ones (they'll show as Unavailable)
      return (p.inStockNum || 0) > 0;
    })
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);

  // --- Revenue Over Time Chart ---
  const months = useMemo(() => {
    const arr = [];
    let m = moment().add(-11, 'months');
    for (let i = 0; i < 12; i++) {
      arr.push(m.format('MMM'));
      m.add(1, 'month');
    }
    return arr;
  }, []);

  const revenueByMonth = useMemo(() => {
    const arr = Array(12).fill(0);
    // Calculate the date 12 months ago
    const twelveMonthsAgo = moment().subtract(12, 'months').startOf('day');
    
    sellingHistory.forEach(item => {
      item.history.forEach(h => {
        // Only process if purchaseDate exists and is valid, and within the last 12 months
        if (h.purchaseDate) {
          const purchaseDate = moment(h.purchaseDate);
          // Only include purchases from the last 12 months
          if (purchaseDate.isAfter(twelveMonthsAgo) || purchaseDate.isSame(twelveMonthsAgo, 'day')) {
            const m = purchaseDate.format('MMM');
            const idx = months.indexOf(m);
            if (idx !== -1) {
              arr[idx] += (h.quantity || 0) * (h.price || 0);
            }
          }
        }
      });
    });
    return arr;
  }, [sellingHistory, months]);

  const revenueChartData = {
    labels: months,
    datasets: [
      {
        label: 'Revenue ($)',
        data: revenueByMonth,
        fill: false,
        backgroundColor: 'transparent',
        borderColor: '#00bfae',
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 2,
        pointBackgroundColor: '#00bfae',
        pointBorderColor: '#fff',
      },
    ],
  };

  const revenueChartOptions = {
    plugins: {
      legend: { labels: { color: '#fff' } },
    },
    scales: {
      x: { ticks: { color: '#fff' }, grid: { color: 'rgba(255,255,255,0.08)' } },
      y: { 
        ticks: { color: '#fff' }, 
        grid: { color: 'rgba(255,255,255,0.08)' },
        min: 0, // Set minimum value to 0 to prevent negative axis
        beginAtZero: true // Alternative Chart.js v2 property, kept for compatibility
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      line: { borderJoinStyle: 'round' },
      point: { radius: 2, hoverRadius: 4 },
    },
  };

  // --- Additional Stats ---
  // Average Order Value
  const averageOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;
  // Low Stock Products (Stock Alerts)
  const lowStockCount = products.filter(p => p.inStockNum > 0 && p.inStockNum < 5).length;
  // Out of Stock Products
  const outOfStockCount = products.filter(p => p.inStockNum === 0).length;
  // Monthly Growth
  const now = moment();
  const thisMonth = now.format('MMM');
  const lastMonth = now.clone().subtract(1, 'month').format('MMM');
  const thisMonthIdx = months.indexOf(thisMonth);
  const lastMonthIdx = months.indexOf(lastMonth);
  const thisMonthRevenue = thisMonthIdx !== -1 ? revenueByMonth[thisMonthIdx] : 0;
  const lastMonthRevenue = lastMonthIdx !== -1 ? revenueByMonth[lastMonthIdx] : 0;
  let monthlyGrowth = 0;
  if (lastMonthRevenue > 0) {
    monthlyGrowth = ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;
  } else if (thisMonthRevenue > 0) {
    monthlyGrowth = 100;
  } else {
    monthlyGrowth = 0;
  }
  const growthColor = monthlyGrowth > 0 ? '#00e676' : (monthlyGrowth < 0 ? '#ff5252' : '#b0b8c1');
  const growthSign = monthlyGrowth > 0 ? '+' : '';

  // --- Top Categories by Sales Count ---
  const categorySalesMap = {};
  sellingHistory.forEach(item => {
    const cat = extractCategoryName(item.product?.category);
    let sales = 0;
    item.history.forEach(h => { sales += toNumber(h.quantity); });
    if (!categorySalesMap[cat]) categorySalesMap[cat] = 0;
    categorySalesMap[cat] += sales;
  });
  const topCategories = Object.entries(categorySalesMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // --- Product Table Columns ---
  const columns = [
    {
      field: "image",
      headerName: "Image",
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <img
              src={params.row.image}
          alt={params.row.name}
          style={{ width: "50px", height: "50px", borderRadius: 8, objectFit: 'cover' }}
            />
      ),
    },
    {
      field: "name",
      headerName: "Product Name", 
      width: 250,
      renderCell: (params) => (
        <Typography 
          sx={{ 
            color: textPrimary,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: 240
          }}
        >
          {params.row.name}
        </Typography>
      ),
    },
    {
      field: "category",
      headerName: "Category",
      width: 180,
      renderCell: (params) => (
        <Typography sx={{ color: textPrimary }}>
          {extractCategoryName(params.row.category)}
        </Typography>
      ),
    },
    { field: "brand", headerName: "Brand", width: 120 },
    {
      field: "price",
      headerName: "Price ($)",
      type: "number",
      width: 120,
      renderCell: (params) => (
        <Typography sx={{ color: accent2, fontWeight: 600 }}>
          ${formatPrice(params.row.price)}
        </Typography>
      ),
    },
    {
      field: "inStockNum",
      headerName: "Stock",
      type: "number",
      width: 100,
      renderCell: (params) => (
        <Typography sx={{ 
          color: params.row.inStockNum > 0 
            ? (params.row.inStockNum < 5 ? '#ffb300' : accent2) 
            : '#ef4444',
          fontWeight: 600
        }}>
          {params.row.inStockNum || 0}
        </Typography>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 130,
      renderCell: (params) => {
        const status = params.row.isDeleted 
          ? "Unavailable" 
          : (params.row.inStockNum > 0 ? "In Stock" : "Out of Stock");
        const statusColor = params.row.isDeleted 
          ? '#ef4444' 
          : (params.row.inStockNum > 0 ? accent2 : '#ef4444');
        return (
          <Typography sx={{ color: statusColor, fontWeight: 500 }}>
            {status}
          </Typography>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 80,
      sortable: false,
      renderCell: (params) => (
        <Tooltip title="Edit Product" arrow>
            <Link to={"/seller/products/edit/" + params.row._id}>
            <EditOutlinedIcon sx={{ 
              color: accent, 
              fontSize: 22, 
              transition: 'all 0.2s',
              cursor: 'pointer',
              '&:hover': { 
                color: accent2,
                transform: 'scale(1.1)'
              } 
            }} />
            </Link>
        </Tooltip>
      ),
    },
  ];

  // Sidebar logout handler
  const handleLogout = () => {
    dispatch(authActions.logout());
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: darkBg }}>
      {/* Sidebar */}
      <Box sx={{
        width: 230,
        background: sidebarBg,
        color: textPrimary,
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        py: 3,
        px: 2,
        boxShadow: '2px 0 12px 0 rgba(0,0,0,0.18)',
      }}>
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={'/images/shopnow.png'} alt="Logo" style={{ height: 38, objectFit: 'contain' }} />
        </Box>
        {sidebarLinks.map((link, idx) =>
          link.divider ? (
            <Box key={idx} sx={{ my: 2, borderBottom: '1px solid #23283a' }} />
          ) : link.label === 'Log out' ? (
            <Button
              key={link.label}
              startIcon={link.icon}
              sx={{
                justifyContent: 'flex-start',
                color: textPrimary,
                borderRadius: 2,
                px: 2,
                py: 1.2,
                mb: 1,
                textTransform: 'none',
                fontSize: '0.875rem',
                fontWeight: 500,
                '&:hover': { background: accent + '22' },
              }}
              fullWidth
              onClick={handleLogout}
            >
              {link.label}
          </Button>
          ) : (
            <Button
              key={link.label}
              startIcon={link.icon}
              sx={{
                justifyContent: 'flex-start',
                color: textPrimary,
                background: link.label === 'Analytics' ? accent + '22' : 'none',
                fontWeight: link.label === 'Analytics' ? 600 : 500,
                borderRadius: 2,
                px: 2,
                py: 1.2,
                mb: 1,
                textTransform: 'none',
                fontSize: '0.875rem',
                '&:hover': { background: accent + '22' },
              }}
              fullWidth
              component={Link}
              to={link.path}
            >
              {link.label}
            </Button>
          )
        )}
      </Box>
      {/* Main Content */}
      <Box sx={{ flex: 1, minWidth: 0, background: darkBg }}>
        {/* Stat Cards */}
        <Container maxWidth="xl" sx={{ mt: 4, pt: 3 }}>
          {/* Top Stat Cards Row */}
          <Grid container spacing={3} alignItems="stretch">
            <Grid item xs={12} md={2}><Box sx={{ background: statCardBg, borderRadius: 3, boxShadow: statCardShadow, p: 3, height: 110, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}><Typography variant="body2" sx={{ color: textSecondary, mb: 0.5 }}>Total Sales</Typography><Typography variant="h5" fontWeight={700} sx={{ color: accent }}>{totalSales}</Typography><Typography variant="caption" sx={{ color: growthColor, mt: 1, display: 'block' }}>{monthlyGrowth < 0 ? '' : '+'}{monthlyGrowth.toFixed(1)}% since last month</Typography></Box></Grid>
            <Grid item xs={12} md={2}><Box sx={{ background: statCardBg, borderRadius: 3, boxShadow: statCardShadow, p: 3, height: 110, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}><Typography variant="body2" sx={{ color: textSecondary, mb: 0.5 }}>Revenue</Typography><Typography variant="h5" fontWeight={700} sx={{ color: accent2 }}>${totalRevenue.toLocaleString()}</Typography><Typography variant="caption" sx={{ color: growthColor, mt: 1, display: 'block' }}>{monthlyGrowth < 0 ? '' : '+'}{monthlyGrowth.toFixed(1)}% since last month</Typography></Box></Grid>
            <Grid item xs={12} md={2}><Box sx={{ background: statCardBg, borderRadius: 3, boxShadow: statCardShadow, p: 3, height: 110, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}><Typography variant="body2" sx={{ color: textSecondary, mb: 0.5 }}>Total Order</Typography><Typography variant="h5" fontWeight={700} sx={{ color: accent } } >{sellingHistory.reduce((acc, item) => acc + item.history.length, 0)}</Typography><Typography variant="caption" sx={{ color: growthColor, mt: 1, display: 'block' }}>{monthlyGrowth < 0 ? '' : '+'}{monthlyGrowth.toFixed(1)}% since last month</Typography></Box></Grid>
            <Grid item xs={12} md={2}><Box sx={{ background: statCardBg, borderRadius: 3, boxShadow: statCardShadow, p: 3, height: 110, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}><Typography variant="body2" sx={{ color: textSecondary, mb: 0.5 }}>Customers</Typography><Typography variant="h5" fontWeight={700} sx={{ color: accent }}>{totalCustomers}</Typography></Box></Grid>
            <Grid item xs={12} md={2}><Box sx={{ background: statCardBg, borderRadius: 3, boxShadow: statCardShadow, p: 3, height: 110, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}><Typography variant="body2" sx={{ color: textSecondary, mb: 0.5 }}>Products</Typography><Typography variant="h5" fontWeight={700} sx={{ color: accent2 }}>{totalProducts}</Typography></Box></Grid>
            <Grid item xs={12} md={2}><Box sx={{ background: statCardBg, borderRadius: 3, boxShadow: statCardShadow, p: 3, height: 110, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}><Typography variant="body2" sx={{ color: textSecondary, mb: 0.5 }}>Out of Stock</Typography><Typography variant="h5" fontWeight={700} sx={{ color: '#ef4444' }}>{outOfStockCount}</Typography><Typography variant="caption" sx={{ color: textSecondary, mt: 1, display: 'block' }}>0 units</Typography></Box></Grid>
          </Grid>
          {/* Second Row: Additional Stats and Charts */}
          <Grid container spacing={3} sx={{ mt: 1.5 }} alignItems="stretch">
            <Grid item xs={12} md={2}><Box sx={{ background: statCardBg, borderRadius: 3, boxShadow: statCardShadow, p: 3, height: 110, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}><Typography variant="body2" sx={{ color: textSecondary, mb: 0.5 }}>Avg Order Value</Typography><Typography variant="h5" fontWeight={700} sx={{ color: accent2 }}>${averageOrderValue.toFixed(2)}</Typography></Box></Grid>
            <Grid item xs={12} md={2}><Box sx={{ background: statCardBg, borderRadius: 3, boxShadow: statCardShadow, p: 3, height: 110, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}><Typography variant="body2" sx={{ color: textSecondary, mb: 0.5 }}>Low Stock</Typography><Typography variant="h5" fontWeight={700} sx={{ color: '#ffb300' }}>{lowStockCount}</Typography><Typography variant="caption" sx={{ color: textSecondary, mt: 1, display: 'block' }}>1-4 units</Typography></Box></Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ background: cardBg, borderRadius: 3, boxShadow: cardShadow, p: 3, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ color: textPrimary, mb: 1 }}>Revenue Report</Typography>
                <Box sx={{ minHeight: 160 }}>
                  <Line data={revenueChartData} options={{
                    plugins: { legend: { labels: { color: textSecondary } } },
                    layout: { padding: { top: 8, bottom: 8, left: 0, right: 0 } },
                    scales: {
                      x: { ticks: { color: textSecondary, font: { size: 11 } }, grid: { color: '#23283a' } },
                      y: { 
                        ticks: { color: textSecondary, font: { size: 11 } }, 
                        grid: { color: '#23283a' },
                        min: 0, // Set minimum value to 0 to prevent negative axis
                      },
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                    elements: { line: { borderJoinStyle: 'round' }, point: { radius: 3, hoverRadius: 5 } },
                  }} />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ background: cardBg, borderRadius: 3, boxShadow: cardShadow, p: 3, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ color: textPrimary, mb: 1 }}>Top Selling Categories</Typography>
                <Box sx={{ mt: 2 }}>
                  {topCategories.length === 0 ? (
                    <Typography sx={{ color: textSecondary }}>No sales yet.</Typography>
                  ) : (
                    topCategories.map(([cat, count], idx) => (
                      <Box key={extractCategoryName(cat) + idx} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', background: accent2, mr: 1.5 }} />
                        <Typography sx={{ color: textPrimary, flex: 1 }}>{extractCategoryName(cat)}</Typography>
                        <Typography sx={{ color: accent, fontWeight: 600 }}>{toNumber(count)} sold</Typography>
                      </Box>
                    ))
                  )}
                </Box>
              </Box>
            </Grid>
          </Grid>
          {/* Bottom Row: Popular Products Table */}
          <Grid container spacing={3} sx={{ mt: 1.5 }} alignItems="stretch">
            <Grid item xs={12}>
              <Box sx={{ background: cardBg, borderRadius: 3, boxShadow: cardShadow, p: 3, display: 'flex', flexDirection: 'column', minHeight: 260 }}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ color: textPrimary, mb: 1 }}>Popular Products</Typography>
                <Box sx={{ mt: 2, flex: 1, overflow: 'auto' }}>
                  <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', color: textPrimary, fontSize: 15 }}>
                    <Box component="thead" sx={{ background: '#23283a' }}>
                      <Box component="tr">
                        <Box component="th" sx={{ textAlign: 'left', py: 1, px: 1, color: accent2 }}>Photo</Box>
                        <Box component="th" sx={{ textAlign: 'left', py: 1, px: 1, color: accent2 }}>Name</Box>
                        <Box component="th" sx={{ textAlign: 'left', py: 1, px: 1, color: accent2 }}>Category</Box>
                        <Box component="th" sx={{ textAlign: 'left', py: 1, px: 1, color: accent2 }}>Brand</Box>
                        <Box component="th" sx={{ textAlign: 'right', py: 1, px: 1, color: accent2 }}>Price</Box>
                        <Box component="th" sx={{ textAlign: 'right', py: 1, px: 1, color: accent2 }}>Sales</Box>
                        <Box component="th" sx={{ textAlign: 'right', py: 1, px: 1, color: accent2 }}>Status</Box>
                      </Box>
                    </Box>
                    <Box component="tbody">
                      {topProducts.length === 0 ? (
                        <Box component="tr">
                          <Box component="td" colSpan={7} sx={{ textAlign: 'center', py: 3, color: textSecondary }}>No sales yet.</Box>
                        </Box>
                      ) : (
                        topProducts.map((prod) => {
                          const displayName = prod.name.length > 70 ? prod.name.slice(0, 70) + '...' : prod.name;
                          return (
                            <Box component="tr" key={prod._id} sx={{ borderBottom: '1px solid #23283a' }}>
                              <Box component="td" sx={{ py: 1, px: 1 }}><img src={toString(prod.image)} alt={prod.name} style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover' }} /></Box>
                              <Box component="td" sx={{ py: 1, px: 1 }}>{displayName}</Box>
                              <Box component="td" sx={{ py: 1, px: 1 }}>{extractCategoryName(prod.category)}</Box>
                              <Box component="td" sx={{ py: 1, px: 1 }}>{toString(prod.brand, 'N/A')}</Box>
                              <Box component="td" sx={{ py: 1, px: 1, textAlign: 'right' }}>${formatPrice(prod.price)}</Box>
                              <Box component="td" sx={{ py: 1, px: 1, textAlign: 'right' }}>{toNumber(prod.sales)}</Box>
                              <Box component="td" sx={{ py: 1, px: 1, textAlign: 'right' }}>
                                {(prod.isDeleted === true || prod.isDeleted === 'true') ? 'Unavailable' : (prod.inStockNum > 0 ? 'Available' : 'Out of Stock')}
                              </Box>
                            </Box>
                          );
                        })
                      )}
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
          {/* All Products Section */}
          <Grid container spacing={3} sx={{ mt: 1.5, mb: 4 }} alignItems="stretch">
            <Grid item xs={12}>
              <Box sx={{ background: cardBg, borderRadius: 3, boxShadow: cardShadow, p: 3, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" fontWeight={600} sx={{ color: textPrimary }}>
                    All Products ({products.length})
                  </Typography>
                  <Button
                    component={Link}
                    to="/seller/products/add"
                    variant="contained"
                    startIcon={<AddCircleOutlineIcon />}
                    sx={{
                      background: accent,
                      color: '#000',
                      fontWeight: 600,
                      textTransform: 'none',
                      borderRadius: 2,
                      px: 2,
                      '&:hover': { background: accent2 },
                    }}
                  >
                    Add Product
                  </Button>
                </Box>
        {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <Typography sx={{ color: textSecondary }}>Loading products...</Typography>
                  </Box>
                ) : products.length === 0 ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6 }}>
                    <Inventory2Icon sx={{ fontSize: 64, color: textSecondary, mb: 2, opacity: 0.5 }} />
                    <Typography variant="h6" sx={{ color: textSecondary, mb: 1 }}>No products yet</Typography>
                    <Typography variant="body2" sx={{ color: textSecondary, mb: 3 }}>Start by adding your first product</Typography>
                    <Button
                      component={Link}
                      to="/seller/products/add"
                      variant="contained"
                      startIcon={<AddCircleOutlineIcon />}
                      sx={{
                        background: accent,
                        color: '#000',
                        fontWeight: 600,
                        textTransform: 'none',
                        borderRadius: 2,
                        px: 3,
                        '&:hover': { background: accent2 },
                      }}
                    >
                      Add Your First Product
                    </Button>
                  </Box>
                ) : (
                  <Box sx={{ width: '100%', mt: 2 }}>
            <DataGrid
                      rows={products.map((product) => ({
                        ...product,
                        id: product._id,
                        category: extractCategoryName(product.category),
                        status: product.isDeleted 
                          ? 'Unavailable' 
                          : (product.inStockNum > 0 ? 'In Stock' : 'Out of Stock'),
                      }))}
              columns={columns}
                      pageSize={10}
                      rowsPerPageOptions={[5, 10, 20, 50]}
              disableSelectionOnClick
                      sx={{
                        border: 'none',
                        color: textPrimary,
                        '& .MuiDataGrid-cell': {
                          borderColor: '#23283a',
                          color: textPrimary,
                        },
                        '& .MuiDataGrid-columnHeaders': {
                          backgroundColor: '#23283a',
                          color: accent2,
                          fontWeight: 600,
                          borderColor: '#23283a',
                        },
                        '& .MuiDataGrid-row:hover': {
                          backgroundColor: '#23283a',
                        },
                        '& .MuiDataGrid-footerContainer': {
                          borderColor: '#23283a',
                          color: textSecondary,
                        },
                        '& .MuiDataGrid-toolbar': {
                          color: textSecondary,
                        },
                        '& .MuiIconButton-root': {
                          color: textSecondary,
                        },
                      }}
                    />
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default SellerDashboard;
=======
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { productActions } from "../../../../redux/actions/product.actions";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";

import "react-pro-sidebar/dist/css/styles.css";

const SellerProductPage = () => {
  let dispatch = useDispatch();

  const selectedProducts = useSelector((state) => state.product?.products);
  const loading = useSelector((state) => state.product?.loading);

  useEffect(() => {
    dispatch(productActions.getAllProductsForSeller());
  }, [dispatch]);

  const columns = [
    { field: "_id", headerName: "ID", width: 150 },
    {
      field: "product",
      headerName: "Product",
      width: 100,
      editable: true,
      renderCell: (params) => {
        return (
          <div className="productListItem">
            <img
              className="productListImg"
              src={params.row.image}
              style={{ width: "50px" }}
            />
          </div>
        );
      },
    },
    {
      field: "name",
      headerName: "Name",
      width: 180,
      editable: true,
    },
    {
      field: "category",
      headerName: "Category",
      width: 180,
      editable: true,
    },
    {
      field: "brand",
      headerName: "Brand",
      width: 110,
      editable: true,
    },
    {
      field: "price",
      headerName: "Price ($)",
      type: "number",
      width: 100,
      editable: true,
    },
    {
      field: "inStockNum",
      headerName: "Stock",
      type: "number",
      width: 110,
      editable: true,
    },
    {
      field: "status",
      headerName: "Status",
      width: 110,
      editable: true,
      renderCell: (params) => {
        return (
          <div className="productListItem">
            {params.row.inStockNum > 0 ? "In stock" : "Out of stock"}
          </div>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 110,
      editable: true,
      renderCell: (params) => {
        return (
          <>
            <Link to={"/seller/products/edit/" + params.row._id}>
              <Button variant="outlined">Edit</Button>
            </Link>
          </>
        );
      },
    },
  ];

  return (
    <div className="sellerDashboard">
      {/* <div className="d-flex justify-content-center">
        <Link to="/seller/products/add">
          <Button className="my-5 mx-2 w-40 addProductBtn">Add Product</Button>
        </Link>

        <Link to="/seller/history">
          <Button className="my-5 mx-2 w-40 addProductBtn">
            Selling History
          </Button>
        </Link>
      </div> */}
      <ProSidebar>
        <Menu iconShape="square">
          <MenuItem active={true}>
            <Link to="/seller/products">Products</Link>
          </MenuItem>
          <MenuItem>
            <Link to="/seller/products/add">Add Product</Link>
          </MenuItem>
          <MenuItem>
            <Link to="/seller/history">Selling History</Link>
          </MenuItem>
        </Menu>
      </ProSidebar>

      <div className="dataGrid">
        {loading ? (
          <h3>Loading...</h3>
        ) : selectedProducts?.length == 0 ? (
          <h3
            style={{
              textAlign: "center",
              backgroundColor: "rgb(243, 243, 243)",
            }}
          >
            Begin selling by adding products
          </h3>
        ) : (
          <div style={{ height: 380, marginLeft: "30px" }}>
            <DataGrid
              rows={selectedProducts}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              checkboxSelection
              disableSelectionOnClick
              getRowId={(row) => row._id}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerProductPage;
>>>>>>> master
