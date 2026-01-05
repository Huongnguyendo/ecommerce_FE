import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  Chip,
  LinearProgress,
  Divider,
  Avatar
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Timeline as TimelineIcon,
  Refresh as RefreshIcon,
  DateRange as DateRangeIcon,
  Insights as InsightsIcon,
  Speed as SpeedIcon,
  Visibility as VisibilityIcon,
  ShoppingCart as ShoppingCartIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import api from '../../../../redux/api';

const AdminAnalyticsPage = () => {
  const [analytics, setAnalytics] = useState({
    userEngagement: {
      dailyActiveUsers: 0,
      sessionDuration: 0,
      pageViews: 0,
      bounceRate: 0
    },
    revenue: {
      totalRevenue: 0,
      averageOrderValue: 0,
      conversionRate: 0,
      revenueGrowth: 0
    },
    performance: {
      pageLoadTime: 0,
      apiResponseTime: 0,
      errorRate: 0,
      uptime: 0
    },
    trends: {
      userGrowth: [],
      revenueTrend: [],
      topCategories: [],
      peakHours: []
    }
  });

  const [timeRange, setTimeRange] = useState('30d');
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Fetch real analytics data from backend
      const analyticsRes = await api.get(`/orders/analytics?timeRange=${timeRange}`);
      const analyticsData = analyticsRes.data.data || {};

      // If peakHours is empty, don't show it (remove static data)
      const analytics = {
        userEngagement: {
          dailyActiveUsers: analyticsData.userEngagement?.dailyActiveUsers || 0,
          sessionDuration: analyticsData.userEngagement?.sessionDuration || 0,
          pageViews: analyticsData.userEngagement?.pageViews || 0,
          bounceRate: analyticsData.userEngagement?.bounceRate || 0
        },
        revenue: {
          totalRevenue: analyticsData.revenue?.totalRevenue || 0,
          averageOrderValue: analyticsData.revenue?.averageOrderValue || 0,
          conversionRate: analyticsData.revenue?.conversionRate || 0,
          revenueGrowth: analyticsData.revenue?.revenueGrowth || 0
        },
        performance: {
          pageLoadTime: analyticsData.performance?.pageLoadTime || 0,
          apiResponseTime: analyticsData.performance?.apiResponseTime || 0,
          errorRate: analyticsData.performance?.errorRate || 0,
          uptime: analyticsData.performance?.uptime || 0
        },
        trends: {
          userGrowth: analyticsData.trends?.userGrowth || [],
          revenueTrend: analyticsData.trends?.revenueTrend || [],
          topCategories: analyticsData.trends?.topCategories || [],
          peakHours: analyticsData.trends?.peakHours || [] // Only show if we have real data
        }
      };

      setAnalytics(analytics);

    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching analytics:', error);
      }
      setSnackbar({
        open: true,
        message: 'Error loading analytics data',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const AnalyticsCard = ({ title, value, subtitle, icon, color, trend }) => (
    <Card sx={{ height: '100%', background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`, color: 'white' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h6" gutterBottom sx={{ opacity: 0.9 }}>
              {title}
            </Typography>
            <Typography variant="h3" fontWeight="bold">
              {value}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
              {subtitle}
            </Typography>
            {trend && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                {trend > 0 ? (
                  <TrendingUpIcon sx={{ fontSize: 16, mr: 0.5 }} />
                ) : (
                  <TrendingDownIcon sx={{ fontSize: 16, mr: 0.5 }} />
                )}
                <Typography variant="body2">
                  {Math.abs(trend)}% vs last period
                </Typography>
              </Box>
            )}
          </Box>
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  const ChartCard = ({ title, children, icon }) => (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          {icon}
          <Box sx={{ ml: 1 }}>{title}</Box>
        </Typography>
        {children}
      </CardContent>
    </Card>
  );

  const UserEngagementTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
          <AnalyticsCard
            title="Daily Active Users"
            value={analytics.userEngagement.dailyActiveUsers}
            subtitle="Users active today"
            icon={<VisibilityIcon />}
            color="#1976d2"
          />
      </Grid>
      <Grid item xs={12} md={6}>
          <AnalyticsCard
            title="Session Duration"
            value={analytics.userEngagement.sessionDuration > 0 ? `${analytics.userEngagement.sessionDuration}m` : 'N/A'}
            subtitle="Average session time"
            icon={<TimelineIcon />}
            color="#2e7d32"
          />
      </Grid>
      <Grid item xs={12} md={6}>
          <AnalyticsCard
            title="Page Views"
            value={analytics.userEngagement.pageViews.toLocaleString()}
            subtitle="Estimated page views"
            icon={<BarChartIcon />}
            color="#ed6c02"
          />
      </Grid>
      <Grid item xs={12} md={6}>
          <AnalyticsCard
            title="Bounce Rate"
            value={`${analytics.userEngagement.bounceRate}%`}
            subtitle="Users with no orders"
            icon={<TrendingDownIcon />}
            color="#d32f2f"
          />
      </Grid>
      <Grid item xs={12}>
        <ChartCard title="User Growth Trend" icon={<TrendingUpIcon />}>
          <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              📈 Interactive chart would be here (Chart.js/Recharts)
            </Typography>
          </Box>
        </ChartCard>
      </Grid>
    </Grid>
  );

  const RevenueTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <AnalyticsCard
          title="Total Revenue"
          value={`$${analytics.revenue.totalRevenue.toLocaleString()}`}
          subtitle="All-time revenue"
          icon={<MoneyIcon />}
          color="#2e7d32"
          trend={analytics.revenue.revenueGrowth}
        />
      </Grid>
      <Grid item xs={12} md={6}>
          <AnalyticsCard
            title="Average Order Value"
            value={`$${analytics.revenue.averageOrderValue.toFixed(2)}`}
            subtitle="Per transaction"
            icon={<ShoppingCartIcon />}
            color="#1976d2"
          />
      </Grid>
      <Grid item xs={12} md={6}>
          <AnalyticsCard
            title="Conversion Rate"
            value={`${analytics.revenue.conversionRate}%`}
            subtitle="Orders per user"
            icon={<TrendingUpIcon />}
            color="#ed6c02"
          />
      </Grid>
      <Grid item xs={12} md={6}>
        <AnalyticsCard
          title="Revenue Growth"
          value={`+${analytics.revenue.revenueGrowth}%`}
          subtitle="Month over month"
          icon={<BarChartIcon />}
          color="#9c27b0"
          trend={analytics.revenue.revenueGrowth}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <ChartCard title="Revenue by Category" icon={<PieChartIcon />}>
          <Box sx={{ height: 250 }}>
            {analytics.trends.topCategories.map((category, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">{category.name}</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {category.percentage}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={category.percentage} 
                  sx={{ height: 8, borderRadius: 4 }}
                />
                <Typography variant="caption" color="text.secondary">
                  ${category.revenue.toLocaleString()} revenue
                </Typography>
              </Box>
            ))}
          </Box>
        </ChartCard>
      </Grid>
      {analytics.trends.peakHours && analytics.trends.peakHours.length > 0 && (
        <Grid item xs={12} md={6}>
          <ChartCard title="Peak Usage Hours" icon={<TimelineIcon />}>
            <Box sx={{ height: 250 }}>
              {analytics.trends.peakHours.map((hour, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">{hour.hour}</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {hour.users} users
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(hour.users / 100) * 100} 
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              ))}
            </Box>
          </ChartCard>
        </Grid>
      )}
    </Grid>
  );

  const PerformanceTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
          <AnalyticsCard
            title="Page Load Time"
            value={analytics.performance.pageLoadTime > 0 ? `${analytics.performance.pageLoadTime}s` : 'N/A'}
            subtitle="Average load time"
            icon={<SpeedIcon />}
            color="#2e7d32"
          />
      </Grid>
      <Grid item xs={12} md={6}>
          <AnalyticsCard
            title="API Response Time"
            value={analytics.performance.apiResponseTime > 0 ? `${analytics.performance.apiResponseTime}s` : 'N/A'}
            subtitle="Average API response"
            icon={<SpeedIcon />}
            color="#1976d2"
          />
      </Grid>
      <Grid item xs={12} md={6}>
          <AnalyticsCard
            title="Error Rate"
            value={analytics.performance.errorRate > 0 ? `${analytics.performance.errorRate}%` : '0%'}
            subtitle="Failed requests"
            icon={<TrendingDownIcon />}
            color="#ed6c02"
          />
      </Grid>
      <Grid item xs={12} md={6}>
          <AnalyticsCard
            title="Uptime"
            value={analytics.performance.uptime > 0 ? `${analytics.performance.uptime}%` : 'N/A'}
            subtitle="System availability"
            icon={<TrendingUpIcon />}
            color="#2e7d32"
          />
      </Grid>
      <Grid item xs={12}>
        <ChartCard title="Performance Metrics Over Time" icon={<BarChartIcon />}>
          <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              📊 Performance charts would be here
            </Typography>
          </Box>
        </ChartCard>
      </Grid>
    </Grid>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return <UserEngagementTab />;
      case 1:
        return <RevenueTab />;
      case 2:
        return <PerformanceTab />;
      default:
        return <UserEngagementTab />;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ 
          background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Advanced Analytics
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Deep insights into platform performance, user behavior, and business metrics
        </Typography>
      </Box>

      {/* Controls */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="User Engagement" icon={<VisibilityIcon />} />
          <Tab label="Revenue Analytics" icon={<MoneyIcon />} />
          <Tab label="Performance" icon={<SpeedIcon />} />
        </Tabs>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            select
            label="Time Range"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            size="small"
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="7d">Last 7 days</MenuItem>
            <MenuItem value="30d">Last 30 days</MenuItem>
            <MenuItem value="90d">Last 90 days</MenuItem>
            <MenuItem value="1y">Last year</MenuItem>
          </TextField>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchAnalytics}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Tab Content */}
      {renderTabContent()}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ open: false, message: '', severity: 'success' })}
      >
        <Alert
          onClose={() => setSnackbar({ open: false, message: '', severity: 'success' })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminAnalyticsPage;
