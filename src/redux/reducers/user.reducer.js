import * as types from "redux/constants/user.constants";
const initialState = {
  users: [],
  totalPageNum: 1,
  buyingHistory: [],
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
    default:
      return state;
  }
};

export default userReducer;
