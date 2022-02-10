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
  // console.log("sellingHistory", sellingHistory);
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

  // new useEffect and action to get selling history
  useEffect(() => {
    dispatch(productActions.getHistoryForSeller());
  }, [dispatch]);

  return (
    <>
      <div className="sellingHistoryPage">
        {loading ? (
          <h3 style={{ textAlign: "center" }}>Loading ... </h3>
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
      <div className="revenueChart">
        <h3>Last Twelve Months revenue</h3>
        <Line
          datasetIdKey="id"
          data={{
            labels,
            datasets: [{ data: months, label: "revenue ($)" }],
          }}
        />
      </div>
    </>
  );
};

export default SellerProductPage;
