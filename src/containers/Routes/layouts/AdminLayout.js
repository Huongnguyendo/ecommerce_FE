import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Switch, Route } from "react-router-dom";
import NotFoundPage from "components/NotFoundPage";
import AddEditProductPage from "../../AddEditProductPage";
import ProfilePage from "../../Admin/ProfilePage";
import ProductDetailPage from "../../ProductDetailPage";
import PublicNavbar from "../../PublicNavbar";
import AlertMsg from "components/AlertMsg";

const AdminLayout = () => {
  return (
    <>
      <PublicNavbar />
      <Container fluid>
        <Row>
          {/* <SideMenu /> */}
          <Col md={9} lg={10}>
            <AlertMsg />
            <Switch>
              <Route exact path="/admin/profile" component={ProfilePage} />
              {/* <Route exact path="/admin/products" component={BlogListPage} />
              <Route exact path="/admin/products/:id" component={ProductDetailPage} />
              <Route exact path="/admin/products/add" component={AddEditBlogPage} /> */}
              <Route
                exact
                path="/admin/products/edit/:id"
                component={AddEditProductPage}
              />
              <Route component={NotFoundPage} />
            </Switch>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AdminLayout;
