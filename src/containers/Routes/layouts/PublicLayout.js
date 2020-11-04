import React from "react";
import { Container } from "react-bootstrap";
import { Switch, Route } from "react-router-dom";
import AlertMsg from "components/AlertMsg";
import NotFoundPage from "components/NotFoundPage";
import AddEditProductPage from "containers/AddEditProductPage";
import ProductDetailPage from "containers/ProductDetailPage";
import HomePage from "containers/HomePage";
import CartPage from "containers/CartPage";
import PublicNavbar from "containers/PublicNavbar";
import RegisterPage from "containers/RegisterPage";
import LoginPage from "containers/LoginPage";
import PrivateRoute from "containers/Routes/PrivateRoute";
import SellerLayout from "containers/Routes/layouts/SellerLayout";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "redux/actions";


const PublicLayout = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const loading = useSelector((state) => state.auth.loading);


  const handleLogout = () => {
    dispatch(authActions.logout());
  };

  const currentUser = useSelector((state) => state.auth.user);
  const isSeller = (currentUser && currentUser.role === "Seller");

  return (
    <>
      <PublicNavbar />
      <Container>
        {/* <AlertMsg /> */}
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/products/:id" component={ProductDetailPage} />
          <Route path="/cart" component={CartPage} />
          {/* <PrivaPriteRoute exact path="/seller/profile" component={SellerLayout} /> */}
          {/* <PrivateRoute exact path="/products/add" component={AddEditProductPage} />
          <PrivateRoute
            exact
            path="/products/edit/:id"
            component={AddEditProductPage}
          /> */}
          <Route component={NotFoundPage} />
        </Switch>
      </Container>
    </>
  );
};

export default PublicLayout;
