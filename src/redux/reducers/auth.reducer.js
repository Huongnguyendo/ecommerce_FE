import * as types from "redux/constants/auth.constants";
const initialState = {
  user: {},
  isAuthenticated: false,
  loading: false,
};

const authReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case types.REGISTER_REQUEST:
    case types.VERIFY_EMAIL_REQUEST:
      return { ...state, loading: true };
    case types.REGISTER_SUCCESS:
      return { ...state, loading: false };
    case types.REGISTER_FAILURE:
      return { ...state, loading: false };

    case types.LOGIN_REQUEST:
    case types.LOGIN_FACEBOOK_REQUEST:
    case types.LOGIN_GOOGLE_REQUEST:
      return { ...state, loading: true };
    case types.LOGIN_SUCCESS:
    case types.LOGIN_FACEBOOK_SUCCESS:
    case types.LOGIN_GOOGLE_SUCCESS:
    case types.VERIFY_EMAIL_SUCCESS:
      // check trong postman, payload.accessToken vì accessToken nằm trong data
      localStorage.setItem("accessToken", payload.accessToken);
      return {
        ...state,
        user: payload.user,
        accessToken: payload.accessToken,
        loading: false,
        isAuthenticated: true,
      };
    case types.LOGIN_FAILURE:
    case types.LOGIN_FACEBOOK_FAILURE:
    case types.LOGIN_GOOGLE_FAILURE:
    case types.VERIFY_EMAIL_SUCCESS:
      return { ...state, loading: false, isAuthenticated: false };
    case types.LOGOUT:
      return {
        ...state,
        user: null,
        accessToken: null,
        isAuthenticated: false,
        loading: false,
      };
    case types.GET_CURRENT_USER_REQUEST:
      return { ...state, loading: true };
    case types.GET_CURRENT_USER_SUCCESS:
      return {
        ...state,
        user: payload,
        isAuthenticated: true,
        loading: false,
      };
    case types.GET_CURRENT_USER_FAILURE:
      return { ...state, loading: false, isAuthenticated: false };
    default:
      return state;
  }
};

export default authReducer;
