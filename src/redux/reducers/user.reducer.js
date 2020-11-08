import * as types from "redux/constants/user.constants";
const initialState = {
  users: [],
  totalPageNum: 1,
  // selectedUser: {},
  loading: false,
};

const userReducer = (state = initialState, action) => {
  const { type, payload } = action;
  
  switch (type) {
    case types.GET_ALLUSERS_REQUEST: 
    case types.DELETE_USER_REQUEST:
      return { ...state, loading: true};
    case types.GET_ALLUSERS_SUCCESS: 
      console.log("payload ne: ", payload.totalPages);
      return { ...state, loading: false, users: payload.users , totalPageNum: payload.totalPages}
    case types.DELETE_USER_SUCCESS:
      console.log("payload ne: ", payload.totalPages);
      return { ...state, loading: false}
    case types.DELETE_USER_FAILURE:
    case types.GET_ALLUSERS_FAILURE: 
      return { ...state, loading:false, errors: payload}
    default:
      return state;
  }
};

export default userReducer;
