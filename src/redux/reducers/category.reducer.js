import * as types from "redux/constants/category.constants";

const initialState = {
    products: [],
    loading: false,
    error: "",
  };

const categoryReducer = (state = initialState, action) => {
    const { type, payload } = action;

  switch (type) {
    case types.CATEGORY_CHOOSE_REQUEST:
      return { ...state, loading: true };

    case types.CATEGORY_CHOOSE_SUCCESS:
        console.log("products của category ne: ", payload);
      return {
        ...state,
        loading: false,
        products: payload,
        
      };
      
      // return { ...state, cartItems: cartItems, loading: false };

    case types.CATEGORY_CHOOSE_FAILURE:
      return { ...state, loading: false, error: payload };
      

    default:
      return state;
  }  
}

export default categoryReducer;