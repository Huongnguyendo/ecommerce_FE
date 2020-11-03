import Axios from "axios";
import api from "../api";
import { ToastContainer, toast } from 'react-toastify';
import * as types from "../constants/category.constants";


const getProductsWithCategory = (category) => async (dispatch) => {
  try {
    dispatch({ type: types.CATEGORY_CHOOSE_REQUEST, payload: null });
    try {
        console.log("category ne: ", category);
        const res = await api.post("/category", { category });
        console.log(res);
        dispatch({ type: types.CATEGORY_CHOOSE_SUCCESS, payload: res.data.data });
        // dispatch(routeActions.redirect("/login"));
        toast.success(`Get category successfull`);
      } catch (error) {
        dispatch({ type: types.CATEGORY_CHOOSE_FAILURE, payload: error });
      }
  } catch (error) {
    console.log(error);
  }
}

export const categoryActions = {
    getProductsWithCategory,
  };
