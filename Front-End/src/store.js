import { configureStore } from "@reduxjs/toolkit";
import categoriesReducer from "./store/categoriesSlice.js";
import authReducer from "./store/authSlice.js";
import productsReducer from "./store/productsSlice.js";
import cartReducer from "./store/cartSlice.js";
import ordersReducer from "./store/ordersSlice.js";

import couponReducer from "./store/couponSlice.js";

const store = configureStore({
  reducer: {
    categories: categoriesReducer,
    auth: authReducer,
    products: productsReducer,
    cart: cartReducer,
    orders: ordersReducer,
    coupon: couponReducer,
  },
});

export default store;
