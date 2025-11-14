import { configureStore } from '@reduxjs/toolkit';
import categoriesReducer from './store/categoriesSlice.js';
import authReducer from './store/authSlice.js';

const store = configureStore({
  reducer: {
    categories: categoriesReducer,
    auth: authReducer,
  },
});

export default store;
