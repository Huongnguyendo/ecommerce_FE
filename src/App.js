import React, {useEffect} from "react";
import "App.css";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./containers/Routes";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "redux/actions";
import { ClipLoader } from "react-spinners";
// MUI Theme imports
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
// Chat Widget
import ChatWidget from "./components/ChatWidget";
// Error Boundary
import ErrorBoundary from "./components/ErrorBoundary";

// Adding Fontawesome icons
import { library } from "@fortawesome/fontawesome-svg-core";
import {faAngry,faLaugh,faSadCry,faThumbsUp,faHeart,faPlus,faTrashAlt,
faEdit,faChevronLeft,faSort,faCheckSquare,faTimesCircle,faPauseCircle,
faCircle,faUser,faRegistered,faChartLine,faSignOutAlt,faSignInAlt,
} from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";

library.add(
  fab, faAngry,faLaugh,faSadCry,faThumbsUp,faHeart,faPlus,faTrashAlt,
  faEdit,faChevronLeft,faSort,faCheckSquare,faTimesCircle,
  faPauseCircle,faCircle,faUser,faRegistered,faChartLine,faSignOutAlt,faSignInAlt
);

function App() {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken && accessToken !== "undefined") {
      dispatch(authActions.getCurrentUser(accessToken));
    } else {
      dispatch(authActions.logout());
    }
  }, [dispatch]);

  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {loading ? (
          <div
            className="vh-100 vw-100 d-flex justify-content-center align-items-center"
            style={{ background: "#0f172a" }}
          />
        ) : (
          <Router>
            <Routes />
            <ChatWidget />
          </Router>
        )}
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
