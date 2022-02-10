import React from "react";
import { useSelector } from "react-redux";
import { Switch, Route } from "react-router-dom";
import NotFoundPage from "components/NotFoundPage";
import AddEditProductPage from "../../../AddEditProductPage";
import SellerProfilePage from "../../../Profile/SellerProfilePage";
import PublicNavbar from "../../../PublicNavbar";
import PrivateSellerRoute from "../../PrivateSellerRoute";
import SellerProducts from "../Seller/SellerProducts";
import SellerHistory from "../Seller/SellerHistory";

const SellerLayout = () => {
  let currentUser = useSelector((state) => state.auth.user);

  return (
    <>
      <PublicNavbar />
      <div>
        <Switch>
          <PrivateSellerRoute exact path="/" component={SellerProducts} />
          <PrivateSellerRoute
            exact
            path="/seller/products"
            component={SellerProducts}
          />
          <PrivateSellerRoute
            exact
            path="/seller/history"
            component={SellerHistory}
          />
          <PrivateSellerRoute
            exact
            path="/seller/products/add"
            component={AddEditProductPage}
          />
          <PrivateSellerRoute
            exact
            path="/seller/products/edit/:id"
            component={AddEditProductPage}
          />
          <PrivateSellerRoute
            path="/seller/profile"
            component={SellerProfilePage}
          />
          <Route component={NotFoundPage} />
        </Switch>
      </div>
    </>
  );
};

export default SellerLayout;
