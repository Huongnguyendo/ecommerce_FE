import * as types from "redux/constants/user.constants";
import api from "redux/api";
import { routeActions } from "../actions";
import { toast } from "react-toastify";

const getAllUsersForAdmin = () => async (dispatch) => {
    
    dispatch({ type: types.GET_ALLUSERS_REQUEST, payload: null });
    
    try {
        const res = await api.get("/auth/admin/allusers");
        console.log("res day ne ", res);
        dispatch({ type: types.GET_ALLUSERS_SUCCESS, payload: res.data.data });
        dispatch(routeActions.redirect("/login"));
        toast.success(`Get all users succesfully`);
    } catch (error) {
        dispatch({ type: types.GET_ALLUSERS_FAILURE, payload: error });
    }
}

const deleteForAdmin = (userID) => async (dispatch) => {
    
    dispatch({ type: types.DELETE_USER_REQUEST, payload: null });
    
    try {
        const res = await api.delete("/auth/admin/user/" + userID);
        console.log("res day ne ", res);
        dispatch({ type: types.DELETE_USER_SUCCESS, payload: res.data.data });
        dispatch(routeActions.redirect("/login"));
        toast.success(`Get all users succesfully`);
    } catch (error) {
        dispatch({ type: types.DELETE_USER_FAILURE, payload: error });
    }
}

export const userActions = {
    getAllUsersForAdmin,
    deleteForAdmin,
};
