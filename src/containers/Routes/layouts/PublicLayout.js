import React from "react";
import { Container } from "react-bootstrap";
import { Switch, Route } from "react-router-dom";
import AlertMsg from "components/AlertMsg";
import NotFoundPage from "components/NotFoundPage";
import AddEditProductPage from "containers/AddEditProductPage";
import ProductDetailPage from "containers/ProductDetailPage";
import HomePage from "containers/HomePage";
import LoginPage from "containers/LoginPage";
import CartPage from "containers/CartPage";
import PublicNavbar from "containers/PublicNavbar";
import RegisterPage from "containers/RegisterPage";
import PrivateRoute from "containers/Routes/PrivateRoute";

const PublicLayout = () => {
  return (
    <>
      <PublicNavbar />
      <Container>
        {/* <AlertMsg /> */}
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/register" component={RegisterPage} />
          <Route exact path="/products/:id" component={ProductDetailPage} />
          <Route path="/products/cart/:id" component={CartPage} />
          <PrivateRoute exact path="/products/add" component={AddEditProductPage} />
          <PrivateRoute
            exact
            path="/products/edit/:id"
            component={AddEditProductPage}
          />
          <Route component={NotFoundPage} />
        </Switch>
      </Container>
    </>
  );
};

export default PublicLayout;
