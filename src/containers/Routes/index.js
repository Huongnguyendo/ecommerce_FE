import React from "react";
import { Route, Switch } from "react-router-dom";
import AdminLayout from "containers/Routes/layouts/AdminLayout";
import PublicLayout from "containers/Routes/layouts/PublicLayout";
import PrivateRoute from "containers/Routes/PrivateRoute";

const Routes = (props) => {
  return (
    <Switch>
      <PrivateRoute path="/admin" component={AdminLayout} />
      <Route path="/" component={PublicLayout} />
    </Switch>
  );
};
export default Routes;
