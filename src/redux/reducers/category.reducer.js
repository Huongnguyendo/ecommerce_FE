import * as types from "redux/constants/category.constants";

const initialState = {
    products: [],
    loading: false,
    totalPages: 1,
    error: "",
  };

const categoryReducer = (state = initialState, action) => {
    const { type, payload } = action;

  switch (type) {
    case types.CATEGORY_CHOOSE_REQUEST:
      return { ...state, loading: true };

    case types.CATEGORY_CHOOSE_SUCCESS:
        
      return {
        ...state,
        loading: false,
        products: payload.products,
        totalPages: payload.totalPages
        
      };
      
      // return { ...state, cartItems: cartItems, loading: false };

    case types.CATEGORY_CHOOSE_FAILURE:
      return { ...state, loading: false, error: payload };
      

    default:
      return state;
  }  
}

export default categoryReducer;