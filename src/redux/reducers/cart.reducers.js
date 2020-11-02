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
    case types.CART_ADD_ITEM_REQUEST:
      return { ...state, loading: true };

    case types.CART_ADD_ITEM_SUCCESS:
      const item = payload;
      const product = state.cartItems.find(x => x.product === item.product);
      if (product) {
        return {
          cartItems:
            state.cartItems.map(x => x.product === product.product ? item : x)
        };
      }
      return { ...state, cartItems: cartItems, loading: false };

    case types.CART_ADD_ITEM_FAILURE:
      return { ...state, loading: false, error: payload };
      
    
    default:
      return state;
  }  
}

export { cartReducer }