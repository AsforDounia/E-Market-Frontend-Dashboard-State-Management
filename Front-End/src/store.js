import { configureStore } from '@reduxjs/toolkit';
import categoriesReducer from './store/categoriesSlice.js';

const store = configureStore({
  reducer: {
    categories: categoriesReducer,
  },
});

export default store;
