import * as types from "redux/constants/user.constants";
const initialState = {
  users: [],
  totalPageNum: 1,
  buyingHistory: [],
  wishlist: [],
  // selectedUser: {},
  loading: false,
};

const userReducer = (state = initialState, action) => {
  const { type, payload } = action;
  
  switch (type) {
    case types.GET_ALLUSERS_REQUEST: 
    case types.DELETE_USER_REQUEST:
    case types.GET_USERHISTORY_REQUEST:
      return { ...state, loading: true};
    case types.GET_ALLUSERS_SUCCESS: 
      return { ...state, loading: false, users: payload.users , totalPageNum: payload.totalPages}

    case types.GET_USERHISTORY_SUCCESS:
      return { ...state, loading: false, buyingHistory: payload}

    case types.DELETE_USER_SUCCESS:
      return { ...state, loading: false}
    case types.DELETE_USER_FAILURE:
    case types.GET_ALLUSERS_FAILURE: 
    case types.GET_USERHISTORY_FAILURE:
      return { ...state, loading:false, errors: payload}
    case types.ADD_WISHLIST_SUCCESS:
    case types.REMOVE_WISHLIST_SUCCESS:
    case types.GET_WISHLIST_SUCCESS:
      return { ...state, loading: false, wishlist: payload };
    case types.ADD_WISHLIST_REQUEST:
    case types.REMOVE_WISHLIST_REQUEST:
    case types.GET_WISHLIST_REQUEST:
      return { ...state, loading: true };
    case types.ADD_WISHLIST_FAILURE:
    case types.REMOVE_WISHLIST_FAILURE:
    case types.GET_WISHLIST_FAILURE:
      return { ...state, loading: false, errors: payload };
    default:
      return state;
  }
};

export default userReducer;
