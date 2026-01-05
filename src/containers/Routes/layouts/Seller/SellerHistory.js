<<<<<<< HEAD
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
=======
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { productActions } from "../../../../redux/actions/product.actions";
import moment from "moment";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";

const SellerProductPage = () => {
  let dispatch = useDispatch();

  // const seller = useSelector((state) => state.auth.user);
  const sellingHistory = useSelector((state) => state.product.historyToRender);
  let loading = useSelector((state) => state.product.loading);
  let starting = moment();
  const notBefore = moment().add(-1, "year");
  let labels = [];
  for (let i = 0; i < 12; i++) {
    starting.add(1, "month");
    labels.push(starting.format("MMM"));
  }

  // console.log("labels ", labels);

  let months;
  if (sellingHistory) {
    months = Array(12).fill(0);

    for (let item of sellingHistory) {
      let history = item.history;
      for (let historyItem of history) {
        // console.log(moment(historyItem.purchaseDate).format("MMM"));
        if (!moment(historyItem.purchaseDate).isBefore(notBefore)) {
          months[
            labels.findIndex(
              (label) =>
                label === moment(historyItem.purchaseDate).format("MMM")
            )
          ] += historyItem.quantity * historyItem.price;
        }
      }
    }
  }
>>>>>>> master

  useEffect(() => {
    dispatch(productActions.getHistoryForSeller());
  }, [dispatch]);

<<<<<<< HEAD
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
=======
  return (
    <>
      <div className="revenueChart">
        <h2>Last Twelve Months revenue</h2>
        <Line
          datasetIdKey="id"
          data={{
            labels,
            datasets: [{ data: months, label: "Revenue ($)" }],
          }}
        />
      </div>
      <div className="sellingHistoryPage">
        <h2>Selling Details</h2>
        {loading ? (
          <h2 style={{ textAlign: "center" }}>Loading ... </h2>
        ) : sellingHistory?.length <= 0 ? (
          <h1 style={{ textAlign: "center", marginTop: "30px" }}>
            No Selling History
          </h1>
        ) : (
          <div className="table-wrapper">
            <table className="seller-table">
              <thead>
                <tr>
                  <td>Image</td>
                  <td>Category</td>
                  <td>Brand</td>
                  <td>Name</td>
                  <td>Price</td>
                  <td>Buyer</td>
                  <td>Time Bought</td>
                  <td>Quantity</td>
                </tr>
              </thead>
              <tbody>
                {sellingHistory?.map((item) => (
                  <tr>
                    <td className="table-pic">
                      <img src={item.product.image} />
                    </td>
                    <td>{item.product.category}</td>
                    <td>{item.product.brand}</td>
                    <td>{item.product.name}</td>
                    <td>${item.product.price}</td>
                    <td className="no-padding">
                      {item.history?.map((innerItem) => (
                        <div>{innerItem.buyer?.name}</div>
                      ))}
                    </td>
                    <td className="no-padding">
                      {item.history?.map((innerItem) => (
                        <div>
                          {moment(innerItem.purchaseDate).format("DD/MM/YYYY")}
                        </div>
                      ))}
                    </td>
                    <td className="no-padding text-center">
                      {item.history?.map((innerItem) => (
                        <div>{innerItem.quantity}</div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default SellerProductPage;
>>>>>>> master
