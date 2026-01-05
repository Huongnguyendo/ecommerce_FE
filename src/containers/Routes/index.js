import React from "react";
import { useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
import AdminLayout from "containers/Routes/layouts/Admin/AdminLayout";
import SellerLayout from "containers/Routes/layouts/Seller/SellerLayout";
import PublicLayout from "containers/Routes/layouts/PublicLayout";
import PrivateAdminRoute from "containers/Routes/PrivateAdminRoute";
import PrivateSellerRoute from "containers/Routes/PrivateSellerRoute";
import PrivateRoute from "containers/Routes/PrivateRoute";
import RegisterPage from "containers/RegisterPage";
import LoginPage from "containers/LoginPage";
import Privacy from "containers/Privacy";

const Routes = (props) => {
  const loading = useSelector((state) => state.auth.loading);
  const user = useSelector((state) => state.auth.user);
  if (loading) return <></>;

  return (
    <Switch>
      <Route exact path="/privacy" component={Privacy} />
      <Route exact path="/login" component={LoginPage} />
      <Route exact path="/register" component={RegisterPage} />
      <PrivateAdminRoute path="/admin" component={AdminLayout} />
      <PrivateSellerRoute path="/seller" component={SellerLayout} />
      <PrivateRoute path="/user" component={PublicLayout} />
      <Route
        path="/"
<<<<<<< HEAD
        component={
          user && user.role === "Admin" ? AdminLayout :
          user && user.role === "Seller" ? SellerLayout : 
          PublicLayout
        }
=======
        component={user && user.role === "Seller" ? SellerLayout : PublicLayout}
>>>>>>> master
      />
    </Switch>
  );
};
export default Routes;
