import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { productActions } from "../../../../redux/actions/product.actions";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { MenuBookIcon, ThumbUpIcon } from "@mui/icons-material";

import "react-pro-sidebar/dist/css/styles.css";

const SellerProductPage = () => {
  let dispatch = useDispatch();

  const selectedProducts = useSelector((state) => state.product?.products);
  const loading = useSelector((state) => state.product?.loading);

  useEffect(() => {
    dispatch(productActions.getAllProductsForSeller());
  }, []);

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
          // (
          //   selectedProducts?.map((product) => (
          //     <div className="sellerProductItem col-md-4 col-sm-4 col-xs-6">
          //       <Link
          //         to={"/seller/products/edit/" + product._id}
          //         style={{ textDecoration: "none" }}
          //       >
          //         <div
          //           className="productCard float-left"
          //           style={{ borderRadius: "15px" }}
          //         >
          //           <div className="productCardImg">
          //             {product.image && <img src={product.image} />}
          //           </div>
          //           <div className="productCardBody">
          //             <Badge variant="warning" style={{ fontSize: "12px" }}>
          //               {product.category}
          //             </Badge>
          //             <h3 className="productCardName">{product.name}</h3>
          //             <p
          //               className="productCardPrice"
          //               style={{ paddingLeft: "10px" }}
          //             >
          //               ${product.price}
          //             </p>
          //             <div className="productCardDes-Btn">
          //               <p className="productCardDescription">
          //                 {product.description.length < 80
          //                   ? product.description
          //                   : product.description.slice(0, 80) + "..."}
          //               </p>
          //               <button className="productCardBtn">DETAILS</button>
          //             </div>
          //           </div>
          //         </div>
          //       </Link>
          //     </div>
          //   ))
          // )
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

{
  /* <Link
                to={"/seller/products/edit/" + product._id}
                style={{ textDecoration: "none" }}
              ></Link> */
}
