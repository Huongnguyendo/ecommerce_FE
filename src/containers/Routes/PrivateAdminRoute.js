import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateAdminRoute = ({ ...rest }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const currentUser = useSelector((state) => state.auth.user);
  const isAdmin = (currentUser && currentUser.role === "Admin");
  const loading = useSelector(state => state.auth.loading);

  if (loading) return <></>;

  if (isAuthenticated && isAdmin) return <Route {...rest} />;
  delete rest.component;
  return <Route {...rest} render={(props) => <Redirect to="/login" />} />;
};

export default PrivateAdminRoute;
