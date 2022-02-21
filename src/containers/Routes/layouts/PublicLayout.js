import React from "react";
import { Switch, Route } from "react-router-dom";
import NotFoundPage from "components/NotFoundPage";
import ProductDetailPage from "containers/ProductDetailPage";
import HomePage from "containers/HomePage";
import CartPage from "containers/CartPage";
import PublicNavbar from "containers/PublicNavbar";
import ProfilePage from "containers/Profile/ProfilePage";
import UserHistoryPage from "containers/Profile/UserHistoryPage";

const PublicLayout = () => {
  return (
    <div>
      <PublicNavbar />
      <div className="content">
        {/* <AlertMsg /> */}
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/products/:id" component={ProductDetailPage} />
          <Route path="/cart" component={CartPage} />
          <Route path="/user/profile" component={ProfilePage} />
          <Route path="/user/history" component={UserHistoryPage} />

          <Route component={NotFoundPage} />
        </Switch>
      </div>
    </div>
  );
};

export default PublicLayout;
