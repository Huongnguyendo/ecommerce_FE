import { faSlideshare } from "@fortawesome/free-brands-svg-icons";
import * as types from "redux/constants/cart.constants";

const initialState = {
    cartItems: [],
    shipping: {},
    payment: {},
    loading: false,
    error: "",
  };

const cartReducer = (state = initialState, action) => {
    const { type, payload } = action;

  switch (type) {
    case types.GET_CART_ITEMS_REQUEST:
    case types.CART_ADD_ITEM_REQUEST:
      return { ...state, loading: true };

    case types.GET_CART_ITEMS_SUCCESS:
    case types.CART_ADD_ITEM_SUCCESS:
      // const item = payload;
      // const product = state.cartItems.find(x => x.product === item.product);
      // if (product) {
      //   return {
      //     cartItems:
      //       state.cartItems.map(x => x.product === product.product ? item : x)
      //   };
      // }
      return {
        ...state,
        loading: false,
        cartItems: payload.cartItems,
      };
      // return { ...state, cartItems: cartItems, loading: false };

    case types.GET_CART_ITEMS_FAILURE:
    case types.CART_ADD_ITEM_FAILURE:
      return { ...state, loading: false, error: payload };
      
    
    default:
      return state;
  }  
}

export default cartReducer;