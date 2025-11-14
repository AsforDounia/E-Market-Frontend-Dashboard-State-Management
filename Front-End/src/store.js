import { configureStore } from "@reduxjs/toolkit";
import categoriesReducer from "./store/categoriesSlice.js";
import authReducer from "./store/authSlice.js";
import productsReducer from "./store/productsSlice.js";

const store = configureStore({
  reducer: {
    categories: categoriesReducer,
    auth: authReducer,
    products: productsReducer,
  },
});

export default store;
