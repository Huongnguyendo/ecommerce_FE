import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col } from "react-bootstrap";
import { Switch, Route } from "react-router-dom";
import NotFoundPage from "components/NotFoundPage";
import AddEditProductPage from "../../../AddEditProductPage";
import ProfilePage from "../../../Profile/ProfilePage";
import SellerProfilePage from "../../../Profile/SellerProfilePage"
import ProductDetailPage from "../../../ProductDetailPage";
import PublicNavbar from "../../../PublicNavbar";
import AlertMsg from "components/AlertMsg";
import PrivateSellerRoute from "../../PrivateSellerRoute";
import SellerSideMenu from "../../layouts/Seller/SellerSideMenu";
import SellerProducts from "../Seller/SellerProducts";
import SellerHistory from "../Seller/SellerHistory";

const SellerLayout = () => {
  let currentUser = useSelector((state) => state.auth.user);
  // console.log("currentUser ne: ", currentUser);

  return (
    <>
      <PublicNavbar />
      <div fluid>
        <Row>
          {/* <SideMenu /> */}
          <Col md={9} lg={10}>
            {/* <AlertMsg /> */}
            <Switch>
              <PrivateSellerRoute  path="/seller/profile" component={SellerProfilePage} />
              <PrivateSellerRoute exact path="/seller/products/add" component={AddEditProductPage} />
              <PrivateSellerRoute
                exact
                path="/seller/products/edit/:id"
                component={AddEditProductPage}
              />
              <PrivateSellerRoute exact path="/seller/products" component={SellerProducts} />
              <PrivateSellerRoute
                exact
                path="/seller/dashboard"
                component={SellerSideMenu}
              />
              <PrivateSellerRoute
                exact
                path="/seller/history"
                component={SellerHistory}
              />
              <Route component={NotFoundPage} />
            </Switch>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default SellerLayout;
