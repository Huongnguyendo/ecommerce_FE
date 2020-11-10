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
import ProfilePage from "containers/Profile/ProfilePage";
import UserHistoryPage from "containers/Profile/UserHistoryPage";
import RegisterPage from "containers/RegisterPage";
import LoginPage from "containers/LoginPage";
import PrivateRoute from "containers/Routes/PrivateRoute";
import SellerLayout from "containers/Routes/layouts/Seller/SellerLayout";
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
      <div>
        {/* <AlertMsg /> */}
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/products/:id" component={ProductDetailPage} />
          <Route path="/cart" component={CartPage} />
          <Route  path="/user/profile" component={ProfilePage} />
          <Route  path="/user/history" component={UserHistoryPage} />
          
          <Route component={NotFoundPage} />
        </Switch>
      </div>
    </>
  );
};

export default PublicLayout;
