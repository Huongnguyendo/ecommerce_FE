import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { productActions } from "../../../../redux/actions/product.actions";
import moment from "moment";
import { extractCategoryName, extractUserName, toNumber, toString, formatPrice } from "../../../../utils/dataTransformers";
import {
  Box,
  Typography,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

// Dark theme variables (match dashboard)
const darkBg = '#181c24';
const cardBg = '#23283a';
const cardShadow = '0 2px 12px 0 rgba(0,0,0,0.18)';
const textPrimary = '#fff';
const textSecondary = '#b0b8c1';
const accent = '#6c63ff';

const SellerHistory = () => {
  const dispatch = useDispatch();
  const sellingHistory = useSelector((state) => state.product.historyToRender);
  const loading = useSelector((state) => state.product.loading);

  useEffect(() => {
    dispatch(productActions.getHistoryForSeller());
  }, [dispatch]);

  // Flatten sales data
  const rows = useMemo(() => {
    if (!sellingHistory || !Array.isArray(sellingHistory)) return [];
    let allRows = [];
    sellingHistory.forEach((item) => {
      if (!item || !item.product || !item.history) return;
      item.history.forEach((innerItem, idx) => {
        if (!innerItem) return;
        
        allRows.push({
          id: `${item.product._id}-${idx}`,
          image: toString(item.product.image),
          category: extractCategoryName(item.product.category),
          brand: toString(item.product.brand, 'N/A'),
          name: toString(item.product.name, 'Product Deleted'),
          price: toNumber(innerItem.price),
          buyer: extractUserName(innerItem.buyer, 'Unknown Buyer'),
          purchaseDate: innerItem.purchaseDate,
          quantity: toNumber(innerItem.quantity),
        });
      });
    });
    return allRows;
  }, [sellingHistory]);

  return (
    <Box sx={{ minHeight: '100vh', background: darkBg, py: 7 }}>
      <Container maxWidth="lg">
        <Box sx={{
          background: cardBg,
          borderRadius: 4,
          boxShadow: cardShadow,
          border: '1px solid #23283a',
          p: 3,
          mb: 5,
          maxWidth: 1100,
          mx: 'auto',
        }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: accent }}>
            All Sales
          </Typography>
          <TableContainer component={Paper} sx={{ background: cardBg, boxShadow: 'none', borderRadius: 3, maxHeight: 480 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: accent, background: darkBg, fontWeight: 700, fontSize: 16 }}>Image</TableCell>
                  <TableCell sx={{ color: accent, background: darkBg, fontWeight: 700, fontSize: 16 }}>Category</TableCell>
                  <TableCell sx={{ color: accent, background: darkBg, fontWeight: 700, fontSize: 16 }}>Brand</TableCell>
                  <TableCell sx={{ color: accent, background: darkBg, fontWeight: 700, fontSize: 16 }}>Name</TableCell>
                  <TableCell sx={{ color: accent, background: darkBg, fontWeight: 700, fontSize: 16 }}>Price</TableCell>
                  <TableCell sx={{ color: accent, background: darkBg, fontWeight: 700, fontSize: 16 }}>Buyer</TableCell>
                  <TableCell sx={{ color: accent, background: darkBg, fontWeight: 700, fontSize: 16 }}>Time Bought</TableCell>
                  <TableCell sx={{ color: accent, background: darkBg, fontWeight: 700, fontSize: 16 }}>Quantity</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ color: textSecondary, py: 6 }}>
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ color: textSecondary, py: 6 }}>
                      No selling history found.
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((row) => {
                    const purchaseDate = row.purchaseDate 
                      ? moment(row.purchaseDate).format('DD/MM/YYYY') 
                      : 'N/A';
                    const displayName = row.name.length > 70 ? row.name.slice(0, 50) + '...' : row.name;
                    
                    return (
                      <TableRow key={row.id} hover sx={{ '&:hover': { background: '#23283a' } }}>
                        <TableCell>
                          <img src={row.image} alt={row.name} style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover' }} />
                        </TableCell>
                        <TableCell sx={{ color: textPrimary }}>{row.category}</TableCell>
                        <TableCell sx={{ color: textPrimary }}>{row.brand}</TableCell>
                        <TableCell sx={{ color: textPrimary }}>{displayName}</TableCell>
                        <TableCell sx={{ color: textPrimary }}>${formatPrice(row.price)}</TableCell>
                        <TableCell sx={{ color: textPrimary }}>{row.buyer}</TableCell>
                        <TableCell sx={{ color: textPrimary }}>{purchaseDate}</TableCell>
                        <TableCell sx={{ color: textPrimary }}>{row.quantity}</TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Container>
    </Box>
  );
};

export default SellerHistory;
