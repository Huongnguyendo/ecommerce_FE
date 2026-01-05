import api from "../api";
<<<<<<< HEAD
import { enqueueSnackbar } from 'notistack';
import { routeActions } from "../actions";
import * as types from "../constants/cart.constants";

const addToCart = (product, quantity, currentPrice) => async (dispatch, getState) => {
  const accessToken = localStorage.getItem('accessToken');
  
  // Guest user: store in localStorage
  if (!accessToken) {
    dispatch({ type: types.CART_ADD_ITEM_REQUEST, payload: null });
    try {
      let guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
      const existingItemIndex = guestCart.findIndex(item => item.productId === product);
      
      if (existingItemIndex > -1) {
        // Update quantity if item exists
        guestCart[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
        guestCart.push({
          productId: product,
          quantity: quantity,
          currentPrice: currentPrice
        });
      }
      
      localStorage.setItem('guestCart', JSON.stringify(guestCart));
      dispatch({ type: types.CART_UPDATE_ITEM_QUANTITY, payload: guestCart });
      // Trigger custom event for navbar to update
      window.dispatchEvent(new Event('guestCartUpdated'));
      enqueueSnackbar(`Added to cart successfully`, { variant: 'success' });
    } catch (error) {
      dispatch({ type: types.CART_ADD_ITEM_FAILURE, payload: error });
      enqueueSnackbar('Failed to add to cart', { variant: 'error' });
    }
    return;
  }
  
  // Logged-in user: call backend API
=======
import { toast } from "react-toastify";
import { routeActions } from "../actions";
import * as types from "../constants/cart.constants";

const addToCart = (product, quantity, currentPrice) => async (dispatch) => {
>>>>>>> master
  try {
    dispatch({ type: types.CART_ADD_ITEM_REQUEST, payload: null });
    try {
      const res = await api.post("/cart/add/", {
        product,
        quantity,
        currentPrice,
      });
      dispatch({ type: types.CART_ADD_ITEM_SUCCESS, payload: res.data.data });
<<<<<<< HEAD
      enqueueSnackbar(`Added to cart successfully`, { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(error.data?.error || 'Failed to add to cart', { variant: 'error' });
      dispatch({ type: types.CART_ADD_ITEM_FAILURE, payload: error });
    }
  } catch (error) {
    enqueueSnackbar(error.data?.error || 'Failed to add to cart', { variant: 'error' });
=======
      toast.success(`Add to cart successfully`);
    } catch (error) {
      toast.error(error.data.error);
      // dispatch(routeActions.redirect("/login"));
      dispatch({ type: types.CART_ADD_ITEM_FAILURE, payload: error });
    }
  } catch (error) {
    // console.log("err", error.data.error);
    toast.error(error.data.error);
>>>>>>> master
  }
};

const getCartItems = () => async (dispatch) => {
  const accessToken = localStorage.getItem('accessToken');
  
  // Guest user: load from localStorage
  if (!accessToken) {
    try {
      const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
      dispatch({ type: types.CART_UPDATE_ITEM_QUANTITY, payload: guestCart });
    } catch (error) {
      // Silently handle error
    }
    return;
  }
  
  // Logged-in user: fetch from backend
  try {
    dispatch({ type: types.GET_CART_ITEMS_REQUEST, payload: null });
    try {
      const res = await api.get("/cart");
      dispatch({ type: types.GET_CART_ITEMS_SUCCESS, payload: res.data.data });
<<<<<<< HEAD
=======
      // console.log("res cua cart ne: ", res.data.data);
>>>>>>> master
    } catch (error) {
      dispatch({ type: types.GET_CART_ITEMS_FAILURE, payload: error });
    }
  } catch (error) {
<<<<<<< HEAD
    // Silently handle error
  }
};

const removeFromCart = (product) => async (dispatch, getState) => {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    // Guest: update localStorage and Redux state instantly
    let guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
    guestCart = guestCart.filter(item => item.productId !== product.productId);
    localStorage.setItem('guestCart', JSON.stringify(guestCart));
    dispatch({ type: types.CART_UPDATE_ITEM_QUANTITY, payload: guestCart });
    window.dispatchEvent(new Event('guestCartUpdated'));
    return;
  }
  // Logged-in: optimistically update Redux state
  const currentCart = getState().cart.cartItems || [];
  const updatedCart = currentCart.filter(item => item.product._id !== product._id);
  dispatch({ type: types.CART_UPDATE_ITEM_QUANTITY_SUCCESS, payload: { cartItems: updatedCart } });
  try {
    await api.post("/cart/remove/", { product });
    // Optionally, re-fetch cart from backend to ensure sync
    // const res = await api.get("/cart");
    // dispatch({ type: types.GET_CART_ITEMS_SUCCESS, payload: res.data.data });
  } catch (error) {
    // Optionally, handle error and revert state if needed
  }
=======
    console.log("err", error.data.error);
    // toast.error(error.message);
  }
};

const removeFromCart = (product) => async (dispatch) => {
  try {
    dispatch({ type: types.CART_REMOVE_ITEM_REQUEST, payload: null });
    try {
      const res = await api.post("/cart/remove/", { product });
      // console.log(res);
      dispatch({
        type: types.CART_REMOVE_ITEM_SUCCESS,
        payload: res.data.data,
      });
      dispatch(routeActions.redirect("/login"));
      toast.success(`Remove from cart successfully`);
    } catch (error) {
      dispatch({ type: types.CART_REMOVE_ITEM_FAILURE, payload: error });
    }
  } catch (error) {
    toast.error(error.message);
  }
>>>>>>> master
};

const checkOutCart = () => async (dispatch) => {
  try {
    dispatch({ type: types.CART_CHECKOUT_REQUEST, payload: null });
    try {
      const res = await api.post("/cart/checkout");
<<<<<<< HEAD
=======
      // console.log(res);
>>>>>>> master
      dispatch({ type: types.CART_CHECKOUT_SUCCESS, payload: res.data.data });
    } catch (error) {
      dispatch({ type: types.CART_CHECKOUT_FAILURE, payload: error });
    }
  } catch (error) {
    enqueueSnackbar(error.message, { variant: 'error' });
  }
};
<<<<<<< HEAD

const updateCartItemQuantity = (productId, quantity) => async (dispatch) => {
  // For guests (not logged in)
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    let guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
    const itemIndex = guestCart.findIndex(item => item.productId === productId);
    if (itemIndex > -1) {
      if (quantity > 0) {
        guestCart[itemIndex].quantity = quantity;
      } else {
        guestCart.splice(itemIndex, 1);
      }
      localStorage.setItem('guestCart', JSON.stringify(guestCart));
      dispatch({ type: types.CART_UPDATE_ITEM_QUANTITY, payload: guestCart });
      window.dispatchEvent(new Event('guestCartUpdated'));
    }
    return;
  }
  // For logged-in users
  try {
    dispatch({ type: types.CART_UPDATE_ITEM_QUANTITY_REQUEST, payload: null });
    const res = await api.post('/cart/update-quantity/', { productId, quantity });
    dispatch({ type: types.CART_UPDATE_ITEM_QUANTITY_SUCCESS, payload: res.data.data });
  } catch (error) {
    dispatch({ type: types.CART_UPDATE_ITEM_QUANTITY_FAILURE, payload: error });
  }
};
=======
>>>>>>> master

export const cartActions = {
  addToCart,
  getCartItems,
  removeFromCart,
  checkOutCart,
<<<<<<< HEAD
  updateCartItemQuantity,
=======
>>>>>>> master
};
