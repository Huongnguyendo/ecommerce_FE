import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col } from "react-bootstrap";
import { Switch, Route } from "react-router-dom";
import NotFoundPage from "components/NotFoundPage";
import AddEditProductPage from "../../../AddEditProductPage";
import AdminProfilePage from "../../../Profile/AdminProfilePage";
import SellerProfilePage from "../../../Profile/SellerProfilePage"
import ProductDetailPage from "../../../ProductDetailPage";
import PublicNavbar from "../../../PublicNavbar";
import AlertMsg from "components/AlertMsg";
import PrivateSellerRoute from "../../PrivateSellerRoute";

const AdminLayout = () => {
  let currentUser = useSelector((state) => state.auth.user);
  console.log("currentUser ne: ", currentUser);

  return (
    <>
      <PublicNavbar />
      <>Admin route here</>
      <Container fluid>
        <Row>
          {/* <SideMenu /> */}
          <Col md={9} lg={10}>
            {/* <AlertMsg /> */}
            <Switch>
              <PrivateSellerRoute  path="/admin/profile" component={SellerProfilePage} />
              {/* <PrivateSellerRoute exact path="/admin/products/add" component={AddEditProductPage} /> */}
              {/* <PrivateSellerRoute
                exact
                path="/seller/products/edit/:id"
                component={AddEditProductPage}
              /> */}
              <Route component={NotFoundPage} />
            </Switch>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AdminLayout;
