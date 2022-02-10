import Axios from "axios";
import api from "../api";
import { toast } from "react-toastify";
import { routeActions } from "../actions";
import * as types from "../constants/cart.constants";

const addToCart = (product, quantity, currentPrice) => async (dispatch) => {
  try {
    dispatch({ type: types.CART_ADD_ITEM_REQUEST, payload: null });
    try {
      const res = await api.post("/cart/add/", {
        product,
        quantity,
        currentPrice,
      });
      dispatch({ type: types.CART_ADD_ITEM_SUCCESS, payload: res.data.data });
      toast.success(`Add to cart successfully`);
    } catch (error) {
      toast.error(error.data.error);
      // dispatch(routeActions.redirect("/login"));
      dispatch({ type: types.CART_ADD_ITEM_FAILURE, payload: error });
    }
  } catch (error) {
    // console.log("err", error.data.error);
    toast.error(error.data.error);
  }
};

const getCartItems = () => async (dispatch) => {
  try {
    dispatch({ type: types.GET_CART_ITEMS_REQUEST, payload: null });
    try {
      const res = await api.get("/cart");
      dispatch({ type: types.GET_CART_ITEMS_SUCCESS, payload: res.data.data });
      // console.log("res cua cart ne: ", res.data.data);
    } catch (error) {
      dispatch({ type: types.GET_CART_ITEMS_FAILURE, payload: error });
    }
  } catch (error) {
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
};

const checkOutCart = () => async (dispatch) => {
  try {
    dispatch({ type: types.CART_CHECKOUT_REQUEST, payload: null });
    try {
      const res = await api.post("/cart/checkout");
      // console.log(res);
      dispatch({ type: types.CART_CHECKOUT_SUCCESS, payload: res.data.data });
    } catch (error) {
      dispatch({ type: types.CART_CHECKOUT_FAILURE, payload: error });
    }
  } catch (error) {
    toast.error(error.message);
  }
};

export const cartActions = {
  addToCart,
  getCartItems,
  removeFromCart,
  checkOutCart,
};
