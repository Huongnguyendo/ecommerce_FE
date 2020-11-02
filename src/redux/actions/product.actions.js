import * as types from "redux/constants/product.constants";
// import routeActions from "./route.actions";
import api from "redux/api";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const getProductList = (pageNum = 1, limit = 10) => async (dispatch) => {
  dispatch({ type: types.GET_PRODUCTS_REQUEST, payload: null });

  try {
    const res = await api.get(`/products?page=${pageNum}&limit=${limit}`);
    dispatch({ type: types.GET_PRODUCTS_SUCCESS, payload: res.data.data });
    console.log("res ne", res);
    console.log("res.data ne", res.data);
    console.log("res.data.data ne", res.data.data);
  } catch (err) {
    dispatch({ type: types.GET_PRODUCTS_FAILURE, payload: err });
  }
};

const getProductDetail = (id) => async (dispatch) => {
  dispatch({ type: types.GET_PRODUCTDETAIL_REQUEST, payload: null });

  try {
    const res = await api.get(`/products/${id}`);
    dispatch({ type: types.GET_PRODUCTDETAIL_SUCCESS, payload: res.data.data });
    console.log("singledata ne", res.data.data);
  } catch (err) {
    dispatch({ type: types.GET_PRODUCTDETAIL_FAILURE, payload: err });
  }
};

const createReview = (productId, reviewText) => async (dispatch) => {
  dispatch({ type: types.CREATE_REVIEW_REQUEST, payload: null });
  try {
    const res = await api.post(`/reviews/products/${productId}`, {
      content: reviewText,
    });
    dispatch({
      type: types.CREATE_REVIEW_SUCCESS,
      payload: res.data.data,
    });
  } catch (error) {
    console.log(error)
    dispatch({ type: types.CREATE_REVIEW_FAILURE, payload: error });
  }
};



const createNewProduct = (title, content, images, redirectTo="__GO_BACK__") => async (dispatch) => {
  dispatch({ type: types.CREATE_PRODUCT_REQUEST, payload: null });
  try {
    const res = await api.post("/products", { title, content, images });
    dispatch({
      type: types.CREATE_PRODUCT_SUCCESS,
      payload: res.data.data,
    });
    // dispatch(routeActions.redirect(redirectTo));
    toast.success("New PRODUCT has been created!");
  } catch (error) {
    console.log(error);
    dispatch({ type: types.CREATE_PRODUCT_FAILURE, payload: error });
  }
};

const updateProduct = (productId, title, content, images, redirectTo="__GO_BACK__") => async (dispatch) => {
  dispatch({ type: types.UPDATE_PRODUCT_REQUEST, payload: null });
  try {
    const res = await api.put(`/products/${productId}`, { title, content, images });
    dispatch({
      type: types.UPDATE_PRODUCT_SUCCESS,
      payload: res.data.data,
    });
    // dispatch(routeActions.redirect(redirectTo));
    toast.success("The PRODUCT has been updated!");
  } catch (error) {
    console.log(error);
    dispatch({ type: types.UPDATE_PRODUCT_FAILURE, payload: error });
  }
};

const deleteProduct = (productId, redirectTo="__GO_BACK__") => async (dispatch) => {
  dispatch({ type: types.DELETE_PRODUCT_REQUEST, payload: null });
  try {
    const res = await api.delete(`/products/${productId}`);
    dispatch({
      type: types.DELETE_PRODUCT_SUCCESS,
      payload: res.data,
    });
    // dispatch(routeActions.redirect(redirectTo));
    toast.success("The PRODUCT has been deleted!");
  } catch (error) {
    console.log(error);
    dispatch({ type: types.DELETE_PRODUCT_FAILURE, payload: error });
  }
};

export const productActions = {
  getProductList,
  getProductDetail,
  createReview,
  createNewProduct,
  updateProduct,
  deleteProduct,
};
