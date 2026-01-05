import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { userActions } from "../../redux/actions/user.actions";
import moment from "moment";
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  Divider,
  Stack,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Button,
} from "@mui/material";
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const UserHistory = () => {
  let dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const buyingHistory = useSelector((state) => state.user.buyingHistory);
  let loading = useSelector((state) => state.user.loading);

  useEffect(() => {
    dispatch(userActions.getHistoryForUser());
  }, [dispatch]);

  // Calculate total orders and total spent
  const totalOrders = buyingHistory?.length || 0;
  const totalSpent = buyingHistory?.reduce((total, order) => {
    return total + order.cartItems.reduce((orderTotal, item) => {
      return orderTotal + (item.currentPrice * item.quantity);
    }, 0);
  }, 0) || 0;

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        bgcolor: '#f8fafb'
      }}>
        <Stack alignItems="center" spacing={2}>
          <CircularProgress size={60} sx={{ color: '#00bfae' }} />
          <Typography variant="h6" color="text.secondary">
            Loading your order history...
          </Typography>
        </Stack>
      </Box>
    );
  }

  if (buyingHistory?.length <= 0) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafb', py: 8 }}>
        <Container maxWidth="md">
          <Paper elevation={0} sx={{ p: 8, textAlign: 'center', borderRadius: 4 }}>
            <Avatar sx={{ 
              width: 80, 
              height: 80, 
              bgcolor: '#e0f7fa', 
              mx: 'auto', 
              mb: 3 
            }}>
              <ShoppingBagIcon sx={{ fontSize: 40, color: '#00bfae' }} />
            </Avatar>
            <Typography variant="h4" fontWeight={700} sx={{ mb: 2, color: '#222' }}>
              No Order History
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              You haven't made any purchases yet. Start shopping to see your orders here!
            </Typography>
            <Button
              variant="contained"
              size="large"
              href="/"
              sx={{
                bgcolor: '#00bfae',
                color: '#fff',
                fontWeight: 700,
                px: 4,
                py: 1.5,
                borderRadius: 3,
                '&:hover': { bgcolor: '#43e6c2' }
              }}
            >
              Start Shopping
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafb', py: 6 }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" fontWeight={800} sx={{ mb: 2, color: '#222' }}>
            Order History
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track and manage all your past orders
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              p: 3, 
              borderRadius: 3, 
              bgcolor: '#fff',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              border: '1px solid #e0e0e0'
            }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: '#e3f2fd', width: 48, height: 48 }}>
                  <ReceiptIcon sx={{ color: '#2196f3' }} />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={700} sx={{ color: '#222' }}>
                    {totalOrders}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Orders
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              p: 3, 
              borderRadius: 3, 
              bgcolor: '#fff',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              border: '1px solid #e0e0e0'
            }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: '#e8f5e8', width: 48, height: 48 }}>
                  <AttachMoneyIcon sx={{ color: '#4caf50' }} />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={700} sx={{ color: '#222' }}>
                    ${totalSpent.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Spent
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>

        {/* Orders Table */}
        <Paper elevation={0} sx={{ 
          borderRadius: 4, 
          overflow: 'hidden',
          border: '1px solid #e0e0e0',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
        }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f8fafb' }}>
                  <TableCell sx={{ fontWeight: 700, color: '#222', py: 3 }}>
                    Order ID
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#222' }}>
                    Products
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#222' }}>
                    Quantity
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#222' }}>
                    Total
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#222' }}>
                    Date
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#222' }}>
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {buyingHistory?.map((order, index) => (
                  <TableRow 
                    key={order._id}
                    sx={{ 
                      '&:hover': { bgcolor: '#f8fafb' },
                      '&:not(:last-child)': { borderBottom: '1px solid #f0f0f0' }
                    }}
                  >
                    <TableCell sx={{ py: 3 }}>
                      <Typography variant="body2" fontWeight={600} sx={{ color: '#666' }}>
                        #{order._id.slice(-8).toUpperCase()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack spacing={1}>
                        {order.cartItems.map((item, idx) => (
                          <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar
                              src={item.product.image}
                              sx={{ width: 40, height: 40, borderRadius: 2 }}
                            />
                            <Box>
                              <Typography variant="body2" fontWeight={600} sx={{ color: '#222' }}>
                                {item.product.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                ${item.currentPrice} each
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack spacing={1}>
                        {order.cartItems.map((item, idx) => (
                          <Chip
                            key={idx}
                            label={item.quantity}
                            size="small"
                            sx={{
                              bgcolor: '#e0f7fa',
                              color: '#00bfae',
                              fontWeight: 600,
                              width: 32,
                              height: 24
                            }}
                          />
                        ))}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6" fontWeight={700} sx={{ color: '#00bfae' }}>
                        ${order.cartItems.reduce((total, item) => 
                          total + (item.currentPrice * item.quantity), 0
                        ).toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarTodayIcon sx={{ fontSize: 16, color: '#666' }} />
                        <Typography variant="body2" color="text.secondary">
                          {moment(order.updatedAt || order.createdAt).format("MMM DD, YYYY")}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label="Completed"
                        color="success"
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    </Box>
  );
};

export default UserHistory;
