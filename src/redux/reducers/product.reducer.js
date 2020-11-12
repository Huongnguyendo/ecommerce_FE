import * as types from "redux/constants/product.constants";
import * as categoryTypes from "../constants/category.constants";
const initialState = {
  historyToRender: [],
  products: [],
  totalPageNum: 1,
  selectedProduct: null,
  loading: false,
  error: "",
};

const productReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case categoryTypes.CATEGORY_CHOOSE_REQUEST:
      return { ...state, loading: true };

    case categoryTypes.CATEGORY_CHOOSE_SUCCESS:
        console.log("products của category ne: ", payload);
      return {
        ...state,
        loading: false,
        products: payload,
        
      };

    case categoryTypes.CATEGORY_CHOOSE_FAILURE:
      return { ...state, loading: false, error: payload };

    case types.GET_PRODUCTS_REQUEST:
    case types.GET_PRODUCTDETAIL_REQUEST:
    case types.GET_PRODUCTDETAILFORSELLER_REQUEST:
    case types.GET_PRODUCTS_BYKEYWORD_REQUEST:
    case types.GET_ALLPRODUCTSFORSELLER_REQUEST:
    case types.GET_HISTORYFORSELLER_REQUEST:
    // case types.CREATE_REVIEW_REQUEST:
      return { ...state, loading: true };

    case types.GET_PRODUCTS_SUCCESS:
    case types.GET_ALLPRODUCTSFORSELLER_SUCCESS:
    // case types.GET_HISTORYFORSELLER_SUCCESS:
      console.log("payyyy", payload.products)
      return {
        ...state,
        loading: false,
        products: payload.products,
        historyToRender: payload.historyToRender,
        totalPageNum: payload.totalPages,
      };

    case "UPDATE_LIST":
      return {
        ...state, products: payload
      }
    case types.GET_HISTORYFORSELLER_SUCCESS:
      console.log("payyyy", payload)
      return {
        ...state,
        loading: false,
        // products: payload.products,
        historyToRender: payload,
        totalPageNum: payload.totalPages,
      };

    case types.GET_PRODUCTS_BYKEYWORD_SUCCESS:
      return {
        ...state,
        loading: false,
        products: payload.products,
        totalPageNum: payload.totalPages,
      };

    case types.GET_PRODUCTS_BYKEYWORD_FAILURE:
    case types.GET_ALLPRODUCTSFORSELLER_FAILURE:
    case types.GET_PRODUCTS_FAILURE:
    case types.GET_HISTORYFORSELLER_FAILURE:
      return { ...state, loading: false, error: payload };

    case types.GET_PRODUCTDETAIL_SUCCESS:
    case types.GET_PRODUCTDETAILFORSELLER_SUCCESS:
      return { ...state, selectedProduct: payload, loading: false };

    case types.GET_PRODUCTDETAIL_FAILURE:
    case types.GET_PRODUCTDETAILFORSELLER_FAILURE:
      return { ...state, loading: false, error: payload };

    case types.CREATE_REVIEW_REQUEST:
      return { ...state, submitLoading: true };
    case types.CREATE_REVIEW_SUCCESS:
      console.log("success ne");
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
