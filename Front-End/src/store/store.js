import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../slices/productsSlice';

import logger from 'redux-logger';

const store = configureStore({
  reducer: {
    products: productsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // ajustez si vous stockez non-serializables (ex: File, Date) :
        ignoredActions: [],
        ignoredPaths: [],
      },
    }).concat(logger)
  ,
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;