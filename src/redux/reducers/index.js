import { combineReducers } from "redux";
import authReducer from "./auth.reducer";
import productReducer from "./product.reducer";
import routeReducer from "./route.reducer";
import userReducer from "./user.reducer";
import cartReducer from "./cart.reducer";
import categoryReducer from "./category.reducer";

export default combineReducers({
  auth: authReducer,
  product: productReducer,
  route: routeReducer,
  user: userReducer,
  cart: cartReducer,
  category: categoryReducer,
});
