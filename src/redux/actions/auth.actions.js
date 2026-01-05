import * as types from "redux/constants/auth.constants";
import api from "redux/api";
import { enqueueSnackbar } from 'notistack';
import { userActions } from './user.actions';

// export const authActions = {};
import { routeActions } from "./route.actions";

const register =
  (name, email, password, avatarUrl, role) => async (dispatch) => {
    dispatch({ type: types.REGISTER_REQUEST, payload: null });
    try {
      const res = await api.post("/users", {
        name,
        email,
        password,
        avatarUrl,
        role,
      });
      dispatch({ type: types.REGISTER_SUCCESS, payload: res.data.data });
      enqueueSnackbar(`Thank you for your registration, ${name}!`, { variant: 'success' });
      // Merge guest wishlist
      const guestWishlist = JSON.parse(localStorage.getItem('guestWishlist') || '[]');
      if (Array.isArray(guestWishlist) && guestWishlist.length > 0) {
        for (const productId of guestWishlist) {
          await dispatch(userActions.addToWishlist(productId));
        }
        localStorage.removeItem('guestWishlist');
        // Fetch the updated wishlist from backend
        await dispatch(userActions.getWishlist());
      }
      // Merge guest cart
      const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
      if (Array.isArray(guestCart) && guestCart.length > 0) {
        for (const item of guestCart) {
          await api.post("/cart/add/", {
            product: item.productId,
            quantity: item.quantity,
            currentPrice: item.currentPrice
          });
        }
        localStorage.removeItem('guestCart');
      }
      dispatch(routeActions.redirect("/login"));
    } catch (error) {
      dispatch({ type: types.REGISTER_FAILURE, payload: error });
    }
  };

const loginRequest = (email, password) => async (dispatch) => {
  dispatch({ type: types.LOGIN_REQUEST, payload: null });
  try {
    const res = await api.post("/auth/login", { email, password });
    dispatch({ type: types.LOGIN_SUCCESS, payload: res.data.data });
    const name = res.data.data.user.name;
    enqueueSnackbar(`Welcome ${name}`, { variant: 'success' });
    
    // Clear anonymous chat history on login
    localStorage.removeItem("chatMessages");
    localStorage.removeItem("chatSessionId");
    
    // Merge guest wishlist
    const guestWishlist = JSON.parse(localStorage.getItem('guestWishlist') || '[]');
    if (Array.isArray(guestWishlist) && guestWishlist.length > 0) {
      for (const productId of guestWishlist) {
        await dispatch(userActions.addToWishlist(productId));
      }
      localStorage.removeItem('guestWishlist');
      // Fetch the updated wishlist from backend
      await dispatch(userActions.getWishlist());
    }
    
    // Merge guest cart
    const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
    if (Array.isArray(guestCart) && guestCart.length > 0) {
      for (const item of guestCart) {
        await api.post("/cart/add/", {
          product: item.productId,
          quantity: item.quantity,
          currentPrice: item.currentPrice
        });
      }
      localStorage.removeItem('guestCart');
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.log("Login error:", error);
    }
    
    // Extract meaningful error message
    let errorMessage = "Login failed. Please try again.";
    
    if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error.response?.status === 400) {
      errorMessage = "Invalid email or password";
    } else if (error.response?.status === 401) {
      errorMessage = "Invalid credentials";
    } else if (error.response?.status === 500) {
      errorMessage = "Server error. Please try again later";
    } else if (error.message === "Network Error" || error.code === "ECONNREFUSED") {
      errorMessage = "Unable to connect to server. Please check your internet connection and try again.";
    } else if (error.message && error.message.includes("Failed to fetch")) {
      errorMessage = "Unable to connect to server. Please try again later.";
    }
    
    enqueueSnackbar(errorMessage, { variant: 'error' });
    dispatch({ type: types.LOGIN_FAILURE, payload: error });
  }
};

const loginFacebookRequest = (access_token) => async (dispatch) => {
  dispatch({ type: types.LOGIN_FACEBOOK_REQUEST, payload: null });
  try {
    const res = await api.post("/auth/login/facebook", { access_token });
    dispatch({ type: types.LOGIN_FACEBOOK_SUCCESS, payload: res.data.data });
    const name = res.data.data.user.name;
    enqueueSnackbar(`Welcome ${name}`, { variant: 'success' });
    
    // Clear anonymous chat history on login
    localStorage.removeItem("chatMessages");
    localStorage.removeItem("chatSessionId");
  } catch (error) {
    // console.log(error);
    dispatch({ type: types.LOGIN_FACEBOOK_FAILURE, payload: error });
  }
};

const loginGoogleRequest = (access_token) => async (dispatch) => {
  dispatch({ type: types.LOGIN_GOOGLE_REQUEST, payload: null });
  try {
    const res = await api.post("/auth/login/google", { access_token });
    dispatch({ type: types.LOGIN_GOOGLE_SUCCESS, payload: res.data.data });
    const name = res.data.data.user.name;
    enqueueSnackbar(`Welcome ${name}`, { variant: 'success' });
    
    // Clear anonymous chat history on login
    localStorage.removeItem("chatMessages");
    localStorage.removeItem("chatSessionId");
  } catch (error) {
    // console.log(error);
    dispatch({ type: types.LOGIN_GOOGLE_FAILURE, payload: error });
  }
};

const logout = () => (dispatch) => {
  delete api.defaults.headers.common["authorization"];
  localStorage.setItem("accessToken", "");
  // Clear chat history on logout
  localStorage.removeItem("chatMessages");
  localStorage.removeItem("chatSessionId");
  dispatch({ type: types.LOGOUT, payload: null });
};

const updateProfile = (name, avatarUrl) => async (dispatch) => {
  dispatch({ type: types.UPDATE_PROFILE_REQUEST, payload: null });
  try {
    const res = await api.put("/users", { name, avatarUrl });
    dispatch({ type: types.UPDATE_PROFILE_SUCCESS, payload: res.data.data });
    enqueueSnackbar(`Your profile has been updated.`, { variant: 'success' });
  } catch (error) {
    dispatch({ type: types.UPDATE_PROFILE_FAILURE, payload: error });
  }
};

const getCurrentUser = (accessToken) => async (dispatch) => {
  dispatch({ type: types.GET_CURRENT_USER_REQUEST, payload: null });
  if (accessToken) {
    const bearerToken = "Bearer " + accessToken;
    api.defaults.headers.common["authorization"] = bearerToken;
  }
  try {
    const res = await api.get("/users/me");
    dispatch({ type: types.GET_CURRENT_USER_SUCCESS, payload: res.data.data });
  } catch (error) {
    dispatch({ type: types.GET_CURRENT_USER_FAILURE, payload: error });
  }
};

const verifyEmail = (code) => async (dispatch) => {
  dispatch({ type: types.VERIFY_EMAIL_REQUEST, payload: null });
  try {
    const res = await api.post("/users/verify_email", { code });
    dispatch({ type: types.VERIFY_EMAIL_SUCCESS, payload: res.data.data });
    const name = res.data.data.user.name;
    enqueueSnackbar(`Welcome, ${name}! Your email address has been verified.`, { variant: 'success' });
    api.defaults.headers.common["authorization"] =
      "Bearer " + res.data.data.accessToken;
  } catch (error) {
    dispatch({ type: types.VERIFY_EMAIL_FAILURE, payload: error });
  }
};

export const authActions = {
  register,
  loginRequest,
  logout,
  updateProfile,
  getCurrentUser,
  loginFacebookRequest,
  loginGoogleRequest,
  verifyEmail,
};
