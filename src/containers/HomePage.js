import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import ProductCard from "components/ProductCard";
import { useSelector, useDispatch } from "react-redux";
import { productActions } from "redux/actions";
import { useHistory, Link } from "react-router-dom";
import PaginationBar from "../components/PaginationBar";

const HomePage = () => {
  const history = useHistory();
  const [pageNum, setPageNum] = useState(1);
  const totalPageNum = useSelector((state) => state.product.totalPageNum);
  let productList = useSelector((state) => state.product.products);
  let loading = useSelector((state) => state.product.loading);

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const dispatch = useDispatch();

  const gotoProductDetail = (index) => {
    history.push(`/products/${index}`);
  };

  useEffect(() => {
    dispatch(productActions.getProductList(pageNum));
  }, [dispatch, pageNum]);

  return (
    <Container>
      {isAuthenticated && (
        <Link to="/products/add">
          <Button variant="primary">Add now</Button>
        </Link>
      )}

      

      <Row style={{ margin: "20px 0" }}>
        
      </Row>
      <Row
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {loading ? (
          <h4 style={{ textAlign: "center" }}>loading</h4>
        ) : (
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
