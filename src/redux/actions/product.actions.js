import * as types from "redux/constants/product.constants";
// import routeActions from "./route.actions";
import api from "redux/api";
import { toast } from "react-toastify";
import { routeActions } from "../actions";
import "react-toastify/dist/ReactToastify.css";

const getProductList =
  (category, pageNum = 1, limit = 10) =>
  async (dispatch) => {
    dispatch({ type: types.GET_PRODUCTS_REQUEST, payload: null });

    try {
      let res;
      if (category)
        res = await api.get(
          `/products?page=1&limit=${limit}&category=${category}`
        );
      else res = await api.get(`/products?page=${pageNum}&limit=${limit}`);
      dispatch({ type: types.GET_PRODUCTS_SUCCESS, payload: res.data.data });
    } catch (err) {
      dispatch({ type: types.GET_PRODUCTS_FAILURE, payload: err });
    }
  };

const getProductDetail = (id) => async (dispatch) => {
  dispatch({ type: types.GET_PRODUCTDETAIL_REQUEST, payload: null });

  try {
    const res = await api.get(`/products/${id}`);
    dispatch({ type: types.GET_PRODUCTDETAIL_SUCCESS, payload: res.data.data });
  } catch (err) {
    dispatch({ type: types.GET_PRODUCTDETAIL_FAILURE, payload: err });
  }
};

const getProductDetailForSeller = (id) => async (dispatch) => {
  dispatch({ type: types.GET_PRODUCTDETAILFORSELLER_REQUEST, payload: null });

  try {
    const res = await api.get(`/products/edit/${id}`);
    dispatch({
      type: types.GET_PRODUCTDETAILFORSELLER_SUCCESS,
      payload: res.data.data,
    });
  } catch (err) {
    dispatch({ type: types.GET_PRODUCTDETAILFORSELLER_FAILURE, payload: err });
  }
};

const getAllProductsForSeller = () => async (dispatch) => {
  dispatch({ type: types.GET_ALLPRODUCTSFORSELLER_REQUEST, payload: null });

  try {
    const res = await api.get(`/seller/products`);
    dispatch({
      type: types.GET_ALLPRODUCTSFORSELLER_SUCCESS,
      payload: res.data.data,
    });
  } catch (err) {
    dispatch({ type: types.GET_ALLPRODUCTSFORSELLER_FAILURE, payload: err });
  }
};

const getHistoryForSeller = () => async (dispatch) => {
  dispatch({ type: types.GET_HISTORYFORSELLER_REQUEST, payload: null });

  try {
    const res = await api.get(`/seller/products/history`);
    dispatch({
      type: types.GET_HISTORYFORSELLER_SUCCESS,
      payload: res.data.data,
    });
  } catch (err) {
    dispatch({ type: types.GET_HISTORYFORSELLER_FAILURE, payload: err });
  }
};

const createReview = (productId, reviewText, rating) => async (dispatch) => {
  dispatch({ type: types.CREATE_REVIEW_REQUEST, payload: null });
  try {
    const res = await api.post(`/reviews/products/${productId}`, {
      content: reviewText,
      rating: rating,
    });
    dispatch({
      type: types.CREATE_REVIEW_SUCCESS,
      payload: res.data.data,
    });
  } catch (error) {
    // console.log(error)
    dispatch({ type: types.CREATE_REVIEW_FAILURE, payload: error });
  }
};

/* 
name: selectedProduct.name,
        description: selectedProduct.description,
        image: selectedProduct.image,
        brand: selectedProduct.brand, 
        price: selectedProduct.price, 
        category: selectedProduct.category, 
        inStockNum: selectedProduct.inStockNum
*/

const createNewProduct =
  (
    name,
    description,
    image,
    brand,
    price,
    category,
    inStockNum,
    redirectTo = "__GO_BACK__"
  ) =>
  async (dispatch) => {
    dispatch({ type: types.CREATE_PRODUCT_REQUEST, payload: null });
    try {
      const res = await api.post("/products/add", {
        name,
        description,
        image,
        brand,
        price,
        category,
        inStockNum,
      });

      dispatch({
        type: types.CREATE_PRODUCT_SUCCESS,
        payload: res.data.data,
      });
      dispatch(routeActions.redirect(redirectTo));
      toast.success("New product has been created!");
    } catch (error) {
      // console.log(error);
      dispatch({ type: types.CREATE_PRODUCT_FAILURE, payload: error });
    }
  };

const updateProduct =
  (
    productId,
    name,
    description,
    image,
    brand,
    price,
    category,
    inStockNum,
    redirectTo = "__GO_BACK__"
  ) =>
  async (dispatch) => {
    dispatch({ type: types.UPDATE_PRODUCT_REQUEST, payload: null });
    try {
      const res = await api.put(`/products/edit/${productId}`, {
        name,
        description,
        image,
        brand,
        price,
        category,
        inStockNum,
      });
      dispatch({
        type: types.UPDATE_PRODUCT_SUCCESS,
        payload: res.data.data,
      });

      dispatch(routeActions.redirect(redirectTo));
      toast.success("The product has been updated!");
    } catch (error) {
      // console.log(error);
      dispatch({ type: types.UPDATE_PRODUCT_FAILURE, payload: error });
    }
  };

const deleteProduct =
  (productId, redirectTo = "__GO_BACK__") =>
  async (dispatch) => {
    dispatch({ type: types.DELETE_PRODUCT_REQUEST, payload: null });
    try {
      const res = await api.delete(`/products/${productId}`);
      dispatch({
        type: types.DELETE_PRODUCT_SUCCESS,
        payload: res.data,
      });
      dispatch(routeActions.redirect(redirectTo));
      toast.success("The product has been deleted!");
    } catch (error) {
      // console.log(error);
      dispatch({ type: types.DELETE_PRODUCT_FAILURE, payload: error });
    }
  };

const searchProductsByKeyword =
  (keyword, pageNum = 1, limit = 10) =>
  async (dispatch) => {
    dispatch({ type: types.GET_PRODUCTS_BYKEYWORD_REQUEST, payload: null });

    try {
      const res = await api.post(`/products/?page=${pageNum}&limit=${limit}`, {
        keyword,
      });
      dispatch({
        type: types.GET_PRODUCTS_BYKEYWORD_SUCCESS,
        payload: res.data.data,
      });
    } catch (err) {
      dispatch({ type: types.GET_PRODUCTS_BYKEYWORD_FAILURE, payload: err });
    }
  };

const updateList = (list) => (dispatch) => {
  dispatch({ type: "UPDATE_LIST", payload: list });
};

export const productActions = {
  getProductList,
  getProductDetail,
  getProductDetailForSeller,
  getAllProductsForSeller,
  getHistoryForSeller,
  createReview,
  createNewProduct,
  updateProduct,
  deleteProduct,
  searchProductsByKeyword,
  updateList,
};
