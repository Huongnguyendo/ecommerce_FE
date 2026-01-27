import React from "react";
import { useDispatch } from "react-redux";
import { Switch, Route, useHistory } from "react-router-dom";
import { ThemeProvider, Box, AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import {
  Menu as MenuIcon,
  Storefront as StorefrontIcon,
  History as HistoryIcon,
  AddBox as AddBoxIcon,
  Person as PersonIcon,
  Logout as LogoutIcon
} from "@mui/icons-material";
import { darkTheme } from '../../../../theme';
import NotFoundPage from "components/NotFoundPage";
import AddEditProductPage from "../../../AddEditProductPage";
import SellerProfilePage from "../../../Profile/SellerProfilePage";
import PrivateSellerRoute from "../../PrivateSellerRoute";
import SellerProducts from "../Seller/SellerProducts";
import SellerHistory from "../Seller/SellerHistory";
import { authActions } from "../../../../redux/actions/auth.actions";

const SellerLayout = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    dispatch(authActions.logout());
    history.push('/');
    window.location.reload();
  };

  const drawerWidth = 240;

  const menuItems = [
    { text: 'Products', icon: <StorefrontIcon />, path: '/seller/products' },
    { text: 'History', icon: <HistoryIcon />, path: '/seller/history' },
    { text: 'Add Product', icon: <AddBoxIcon />, path: '/seller/products/add' },
    { text: 'Profile', icon: <PersonIcon />, path: '/seller/profile' },
  ];

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="subtitle1" fontWeight={700}>
          Seller Panel
        </Typography>
      </Toolbar>
      <List>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            component="a"
            href={item.path}
            sx={{
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        <ListItem
          button
          onClick={handleLogout}
          sx={{
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
        {/* Mobile top bar */}
        <AppBar
          position="fixed"
          sx={{
            display: { xs: 'flex', sm: 'none' },
            bgcolor: 'background.paper',
            color: 'text.primary',
            boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
          }}
        >
          <Toolbar sx={{ minHeight: 56 }}>
            <IconButton edge="start" color="inherit" onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
            <Typography variant="subtitle1" fontWeight={700}>
              Seller Panel
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>

        <Box sx={{ pt: { xs: 7, sm: 0 }, px: { xs: 2, sm: 0 } }}>
        <Switch>
          <PrivateSellerRoute exact path="/" component={SellerProducts} />
          <PrivateSellerRoute
            exact
            path="/seller"
            component={SellerProducts}
          />
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
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default SellerLayout;
