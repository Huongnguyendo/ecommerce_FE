import React from "react";
import {useSelector}  from "react-redux";
import { Route, Switch } from "react-router-dom";
import SellerLayout from "containers/Routes/layouts/SellerLayout";
import PublicLayout from "containers/Routes/layouts/PublicLayout";
import PrivateSellerRoute from "containers/Routes/PrivateSellerRoute";
import PrivateRoute from "containers/Routes/PrivateRoute";

import RegisterPage from "containers/RegisterPage";
import LoginPage from "containers/LoginPage";

const Routes = (props) => {
  const loading = useSelector(state => state.auth.loading);

  if (loading) return <></>;

  return (
    <Switch>
      <Route exact path="/login" component={LoginPage} />
      <Route exact path="/register" component={RegisterPage} />
      <PrivateSellerRoute path="/seller" component={SellerLayout} />
      <PrivateRoute path="/user" component={PublicLayout} />
      <Route path="/" component={PublicLayout} />
    </Switch>
  );
};
export default Routes;
