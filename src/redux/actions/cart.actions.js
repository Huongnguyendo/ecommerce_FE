import Axios from "axios";
import api from "../api";
import { ToastContainer, toast } from 'react-toastify';
import * as types from "../constants/cart.constants";


const addToCart = (product, quantity) => async (dispatch) => {
  try {
    // console.log("haha ", productId, quantity);
    dispatch({ type: types.CART_ADD_ITEM_REQUEST, payload: null });
    try {
        const res = await api.post("/cart/add/", { product, quantity });
        console.log(res);
        dispatch({ type: types.CART_ADD_ITEM_SUCCESS, payload: res.data.data });
        // dispatch(routeActions.redirect("/login"));
        toast.success(`Add to cart successfull`);
      } catch (error) {
        dispatch({ type: types.CART_ADD_ITEM_FAILURE, payload: error });
      }
  } catch (error) {
    console.log(error);
  }
}

const getCartItems = () => async (dispatch) => {
  try {
    dispatch({ type: types.GET_CART_ITEMS_REQUEST, payload: null });
    try {
        const res = await api.get("/cart");
        dispatch({ type: types.GET_CART_ITEMS_SUCCESS, payload: res.data.data });
      } catch (error) {
        dispatch({ type: types.GET_CART_ITEMS_FAILURE, payload: error });
      }
  } catch (error) {
    console.log(error);
  }
}
// const removeFromCart = (productId) => (dispatch, getState) => {
//   dispatch({ type: CART_REMOVE_ITEM, payload: productId });

//   const { cart: { cartItems } } = getState();
//   Cookie.set("cartItems", JSON.stringify(cartItems));
// }
// const saveShipping = (data) => (dispatch) => {
//   dispatch({ type: CART_SAVE_SHIPPING, payload: data });
// }
// const savePayment = (data) => (dispatch) => {
//   dispatch({ type: CART_SAVE_PAYMENT, payload: data });
// }

export const cartActions = {
    addToCart, 
    getCartItems,
  };
