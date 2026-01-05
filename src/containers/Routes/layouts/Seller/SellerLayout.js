import React from "react";
<<<<<<< HEAD
import { useSelector } from "react-redux";
=======
>>>>>>> master
import { Switch, Route } from "react-router-dom";
import { ThemeProvider, Box } from '@mui/material';
import { darkTheme } from '../../../../theme';
import NotFoundPage from "components/NotFoundPage";
import AddEditProductPage from "../../../AddEditProductPage";
import SellerProfilePage from "../../../Profile/SellerProfilePage";
<<<<<<< HEAD
=======
import PublicNavbar from "../../../PublicNavbar";
>>>>>>> master
import PrivateSellerRoute from "../../PrivateSellerRoute";
import SellerProducts from "../Seller/SellerProducts";
import SellerHistory from "../Seller/SellerHistory";

const SellerLayout = () => {
  // let currentUser = useSelector((state) => state.auth.user);

  return (
<<<<<<< HEAD
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
=======
    <>
      <PublicNavbar />
      <div className="content">
>>>>>>> master
        <Switch>
          <PrivateSellerRoute exact path="/" component={SellerProducts} />
          <PrivateSellerRoute
            exact
<<<<<<< HEAD
            path="/seller"
            component={SellerProducts}
          />
          <PrivateSellerRoute
            exact
=======
>>>>>>> master
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
<<<<<<< HEAD
      </Box>
    </ThemeProvider>
=======
      </div>
    </>
>>>>>>> master
  );
};

export default SellerLayout;
