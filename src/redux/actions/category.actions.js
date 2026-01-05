import api from "../api";
<<<<<<< HEAD
import { enqueueSnackbar } from 'notistack';
=======
import { toast } from "react-toastify";
>>>>>>> master
import { routeActions } from "../actions";
import * as types from "../constants/category.constants";

const getProductsWithCategory = (category) => async (dispatch) => {
  try {
    dispatch({ type: types.CATEGORY_CHOOSE_REQUEST, payload: null });
    try {
      const res = await api.post("/category", { category });
      // console.log(res);
      dispatch({ type: types.CATEGORY_CHOOSE_SUCCESS, payload: res.data.data });
      dispatch(routeActions.redirect("/login"));
<<<<<<< HEAD
      enqueueSnackbar(`Get category successfully`, { variant: 'success' });
=======
      toast.success(`Get category successfully`);
>>>>>>> master
    } catch (error) {
      dispatch({ type: types.CATEGORY_CHOOSE_FAILURE, payload: error });
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.log(error);
    }
  }
};

export const categoryActions = {
  getProductsWithCategory,
};
