import api from "../api";
import { enqueueSnackbar } from 'notistack';
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
      enqueueSnackbar(`Get category successfully`, { variant: 'success' });
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
