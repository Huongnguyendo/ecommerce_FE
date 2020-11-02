import * as types from "redux/constants/product.constants";
const initialState = {
  products: [],
  totalPageNum: 1,
  selectedProduct: null,
  loading: false,
  error: "",
};

const productReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case types.GET_PRODUCTS_REQUEST || types.GET_PRODUCTDETAIL_REQUEST:
      return { ...state, loading: true };

    case types.GET_PRODUCTS_SUCCESS:
      return {
        ...state,
        loading: false,
        products: payload.products,
        totalPageNum: payload.totalPages,
      };

    case types.GET_PRODUCTS_FAILURE:
      return { ...state, loading: false, error: payload };

    case types.GET_PRODUCTDETAIL_SUCCESS:
      return { ...state, selectedProduct: payload };

    case types.GET_PRODUCTDETAIL_REQUEST:
      return { ...state, loading: false, error: payload };

    case types.CREATE_REVIEW_REQUEST:
      return { ...state, submitLoading: true };
    case types.CREATE_REVIEW_SUCCESS:
      return {
        ...state,
        selectedProduct: {
          ...state.selectedProduct,
          reviews: [...state.selectedProduct.reviews, payload],
        },
        submitLoading: false,
      };

    case types.CREATE_REVIEW_FAILURE:
      return { ...state, submitLoading: false };

    case types.CREATE_PRODUCT_REQUEST:
    case types.UPDATE_PRODUCT_REQUEST:
    case types.DELETE_PRODUCT_REQUEST:
      return { ...state, loading: true };

    case types.CREATE_PRODUCT_SUCCESS:
      return { ...state, loading: false };
    case types.UPDATE_PRODUCT_SUCCESS:
      return {
        ...state,
        selectedProduct: payload,
        loading: false,
      };
    case types.DELETE_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        selectedProduct: {},
      };

    case types.CREATE_PRODUCT_FAILURE:
    case types.UPDATE_PRODUCT_FAILURE:
    case types.DELETE_PRODUCT_FAILURE:
      return { ...state, loading: false };
      
    default:
      return { ...state };
  }
};

export default productReducer;
