import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Switch, Route, useHistory } from "react-router-dom";
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, Divider, Avatar, Toolbar, IconButton } from "@mui/material";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  Logout as LogoutIcon
} from "@mui/icons-material";
import NotFoundPage from "components/NotFoundPage";
import AdminProfilePage from "../../../Profile/AdminProfilePage";
import AdminDashboard from "./AdminDashboard";
import AdminAllUsersPage from "./AdminAllUsersPage";
import AdminAnalyticsPage from "./AdminAnalyticsPage";
import PrivateAdminRoute from "../../PrivateAdminRoute";
import { authActions } from "../../../../redux/actions/auth.actions";
import { ThemeProvider } from '@mui/material';
import { darkTheme } from '../../../../theme';

const AdminLayout = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const currentUser = useSelector((state) => state.auth.user);
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
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
    { text: 'Users', icon: <PeopleIcon />, path: '/admin/users' },
  ];

  const drawer = (
    <Box>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
            <PersonIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" noWrap>
              Admin Panel
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {currentUser?.name}
            </Typography>
          </Box>
        </Box>
      </Toolbar>
      <Divider />
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
      </List>
      <Divider />
      <List>
        <ListItem
          component="a"
          href="/admin/profile"
          sx={{
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItem>
      </List>
      <Divider />
      <List>
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
      <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh' }}>
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>

        {/* Main content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` }, // Add left margin to account for sidebar
            mt: 2, // Reduced margin since no navbar
            bgcolor: 'background.default',
          }}
        >
            <Switch>
            <PrivateAdminRoute
              exact
              path="/"
              component={AdminDashboard}
            />
            <PrivateAdminRoute
              exact
              path="/admin"
              component={AdminDashboard}
            />
              <PrivateAdminRoute
                exact
                path="/admin/dashboard"
              component={AdminDashboard}
              />
              <PrivateAdminRoute
                path="/admin/profile"
                component={AdminProfilePage}
              />
              <PrivateAdminRoute
                exact
                path="/admin/users"
                component={AdminAllUsersPage}
              />
            <PrivateAdminRoute
              exact
              path="/admin/analytics"
              component={AdminAnalyticsPage}
            />
              <Route component={NotFoundPage} />
            </Switch>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default AdminLayout;
