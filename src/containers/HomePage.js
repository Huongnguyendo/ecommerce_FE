import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import ProductCard from "components/ProductCard";
import { useSelector, useDispatch } from "react-redux";
import { productActions, categoryActions } from "redux/actions";
import { useHistory, Link } from "react-router-dom";
import PaginationBar from "../components/PaginationBar";
import Select from 'react-select';

const HomePage = () => {
  const history = useHistory();
  const [pageNum, setPageNum] = useState(1);

  const [category, setCategory] = useState(null);
  const filterProducts = useSelector((state) => state.category.products)
  console.log("wow: ", filterProducts );

  const totalPageNum = useSelector((state) => state.product.totalPageNum);
  let productList = useSelector((state) => state.product.products);
  let loading = useSelector((state) => state.product.loading);

  const categories = [
    { value: 'Fashion', label: 'Fashion' },
    { value: 'Phones & Accessories', label: 'Phones & Accessories' },
    { value: 'Electronic device', label: 'Electronic device' },
    { value: 'Household goods', label: 'Household goods' },
    { value: 'Home & Life', label: 'Home & Life' },
    { value: 'Health & Life', label: 'Health & Life' },
    { value: 'Fashion Accessories', label: 'Fashion Accessories' },
    { value: 'Books', label: 'Books' },
  ]


  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const dispatch = useDispatch();

  const gotoProductDetail = (index) => {
    history.push(`/products/${index}`);
  };

  useEffect(() => {
    dispatch(productActions.getProductList(pageNum));
  }, [dispatch, pageNum]);

  // useEffect(() => {

  // }, [filterProducts]);

  return (
    <Container>
      {isAuthenticated && (
        <Link to="/products/add">
          <Button variant="primary">Add now</Button>
        </Link>
      )}

      
      <Row style={{ margin: "20px 0" }}></Row>

      <Select options = {categories} onChange={(e) => {setCategory(e.value); dispatch(categoryActions.getProductsWithCategory(e.value))}} />
      {/* dispatch(categoryActions.getCategory(e.value)) */}

      <Row style={{ margin: "20px 0" }}></Row>

      <Row
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {loading ? (
          <h4 style={{ textAlign: "center" }}>loading</h4>
        ) : filterProducts ? (
          filterProducts.map((product) => (
            <ProductCard
              product={product}
              key={product._id}
              gotoProductDetail={gotoProductDetail}
            />
          ))
        )
        : (
          productList.map((product) => (
            <ProductCard
              product={product}
              key={product._id}
              gotoProductDetail={gotoProductDetail}
            />
          ))
        )}
      </Row>
      <PaginationBar
        pageNum={pageNum}
        setPageNum={setPageNum}
        totalPageNum={totalPageNum}
        loading={loading}
      />
    </Container>
  );
};

export default HomePage;
