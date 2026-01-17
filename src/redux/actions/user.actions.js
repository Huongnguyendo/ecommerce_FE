import * as types from "redux/constants/user.constants";
import api from "redux/api";
import { enqueueSnackbar } from 'notistack';

const getAllUsersForAdmin = () => async (dispatch) => {
    
    dispatch({ type: types.GET_ALLUSERS_REQUEST, payload: null });
    
    try {
        const res = await api.get("/auth/admin/allusers");
        dispatch({ type: types.GET_ALLUSERS_SUCCESS, payload: res.data.data });
        // Removed redirect and success message to prevent duplicates
    } catch (error) {
        dispatch({ type: types.GET_ALLUSERS_FAILURE, payload: error });
    }
}

const deleteForAdmin = (userID) => async (dispatch) => {
    
    dispatch({ type: types.DELETE_USER_REQUEST, payload: null });
    
    try {
        const res = await api.delete("/auth/admin/user/" + userID);
        dispatch({ type: types.DELETE_USER_SUCCESS, payload: res.data.data });
        enqueueSnackbar("User deleted successfully", { variant: 'success' });
    } catch (error) {
        dispatch({ type: types.DELETE_USER_FAILURE, payload: error });
        enqueueSnackbar("Failed to delete user", { variant: 'error' });
    }
}

const getHistoryForUser = () => async (dispatch) => {
    
    dispatch({ type: types.GET_USERHISTORY_REQUEST, payload: null });
    
    try {
        const res = await api.get("/users/history");
        dispatch({ type: types.GET_USERHISTORY_SUCCESS, payload: res.data.data });
        // dispatch(routeActions.redirect("/login"));
        // toast.success(`Get buying history succesfully`);
    } catch (error) {
        dispatch({ type: types.GET_USERHISTORY_FAILURE, payload: error });
    }
}

const addToWishlist = (productId) => async (dispatch, getState) => {
    const isAuthenticated = !!getState().auth.user;
    if (!isAuthenticated) {
        // Guest logic
        let guestWishlist = JSON.parse(localStorage.getItem('guestWishlist') || '[]');
        if (!guestWishlist.includes(productId)) {
            guestWishlist.push(productId);
            localStorage.setItem('guestWishlist', JSON.stringify(guestWishlist));
            enqueueSnackbar('Added to wishlist!', { variant: 'success' });
        } else {
            enqueueSnackbar('Already in wishlist', { variant: 'info' });
        }
        return;
    }
    // Logged-in logic (call backend)
    dispatch({ type: types.ADD_WISHLIST_REQUEST });
    try {
        await api.post("/users/wishlist/add", { productId });
        // Backend returns IDs only - don't update wishlist state here
        // User will see the updated wishlist when they visit the wishlist page
        // Just set loading to false without changing wishlist
        dispatch({ type: types.ADD_WISHLIST_SUCCESS, payload: getState().user.wishlist || [] });
        enqueueSnackbar("Added to wishlist!", { variant: 'success' });
    } catch (error) {
        dispatch({ type: types.ADD_WISHLIST_FAILURE, payload: error });
        enqueueSnackbar("Failed to add to wishlist", { variant: 'error' });
    }
};

const getWishlist = () => async (dispatch) => {
    dispatch({ type: types.GET_WISHLIST_REQUEST });
    try {
        const res = await api.get("/users/wishlist");
        dispatch({ type: types.GET_WISHLIST_SUCCESS, payload: res.data.data });
    } catch (error) {
        dispatch({ type: types.GET_WISHLIST_FAILURE, payload: error });
    }
};

const removeFromWishlist = (productId) => async (dispatch, getState) => {
    const currentWishlist = getState().user.wishlist || [];
    
    // Optimistic update: remove from UI immediately
    const optimisticWishlist = currentWishlist.filter(p => {
        const productIdStr = p._id?.toString();
        const removeIdStr = productId?.toString();
        return productIdStr !== removeIdStr;
    });
    dispatch({ type: types.REMOVE_WISHLIST_SUCCESS, payload: optimisticWishlist });
    
    dispatch({ type: types.REMOVE_WISHLIST_REQUEST });
    try {
        await api.post("/users/wishlist/remove", { productId });
        // Refetch to keep UI in sync with backend
        dispatch(getWishlist());
        enqueueSnackbar("Removed from wishlist!", { variant: 'success' });
    } catch (error) {
        // Revert optimistic update on error
        dispatch({ type: types.REMOVE_WISHLIST_SUCCESS, payload: currentWishlist });
        dispatch({ type: types.REMOVE_WISHLIST_FAILURE, payload: error });
        enqueueSnackbar("Failed to remove from wishlist", { variant: 'error' });
    }
};

export const userActions = {
    getAllUsersForAdmin,
    deleteForAdmin,
    getHistoryForUser,
    addToWishlist,
    removeFromWishlist,
    getWishlist,
};
