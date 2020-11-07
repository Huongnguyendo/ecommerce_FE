import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col } from "react-bootstrap";
import { Switch, Route } from "react-router-dom";
import NotFoundPage from "components/NotFoundPage";
import AddEditProductPage from "../../../AddEditProductPage";
import AdminProfilePage from "../../../Profile/AdminProfilePage";
import AdminSideMenu from "../../../Routes/layouts/Admin/AdminSideMenu";
import SellerProfilePage from "../../../Profile/SellerProfilePage"
import ProductDetailPage from "../../../ProductDetailPage";
import PublicNavbar from "../../../PublicNavbar";
import AlertMsg from "components/AlertMsg";
import PrivateAdminRoute from "../../PrivateAdminRoute";
import AdminAllUsersPage from "../../layouts/Admin/AdminAllUsersPage";

const AdminLayout = () => {
  let currentUser = useSelector((state) => state.auth.user);
  console.log("currentUser ne: ", currentUser);

  return (
    <>
      <PublicNavbar />
      {/* <>Admin route here</> */}
      <div fluid>
        <Row>
          {/* <SideMenu /> */}
          <Col md={9} lg={10}>
            {/* <AlertMsg /> */}
            <Switch>
              <PrivateAdminRoute
                exact
                path="/admin/dashboard"
                component={AdminSideMenu}
              />
              <PrivateAdminRoute  path="/admin/profile" component={AdminProfilePage} />
              <PrivateAdminRoute
                exact
                path="/admin/users"
                component={AdminAllUsersPage}
              />
              <Route component={NotFoundPage} />
            </Switch>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default AdminLayout;
