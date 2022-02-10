import * as types from "redux/constants/cart.constants";

const initialState = {
  cartItems: [],
  shipping: {},
  payment: {},
  loading: false,
  isCheckedout: false,
  error: "",
};

const cartReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case types.GET_CART_ITEMS_REQUEST:
    case types.CART_ADD_ITEM_REQUEST:
    case types.CART_REMOVE_ITEM_REQUEST:
    case types.CART_CHECKOUT_REQUEST:
      return { ...state, loading: true };

    case types.GET_CART_ITEMS_SUCCESS:
    case types.CART_ADD_ITEM_SUCCESS:
    case types.CART_REMOVE_ITEM_SUCCESS:
      return {
        ...state,
        loading: false,
        cartItems: payload.cartItems,
      };

    case types.CART_CHECKOUT_SUCCESS:
      return {
        ...state,
        loading: false,
        isCheckedout: payload.isCheckedout,
        cartItems: [],
        // cartItems: payload.cartItems,
      };
    // return { ...state, cartItems: cartItems, loading: false };
    case types.GET_CART_ITEMS_FAILURE:
    case types.CART_ADD_ITEM_FAILURE:
    case types.CART_REMOVE_ITEM_FAILURE:
    case types.CART_CHECKOUT_FAILURE:
      return { ...state, loading: false, error: payload };

    default:
      return state;
  }
};

export default cartReducer;
