import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

// Async thunk pour récupérer la liste des produits
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params = {}, thunkAPI) => {
    try {
      // params peut contenir { page, limit, search, category, ... }
      const response = await api.get('/products', { params });
      return response.data;
    } catch (error) {
      // Propager une erreur compréhensible
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

const initialState = {
  items: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  page: 1,
  total: 0,
  metadata: {},
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProducts(state) {
      state.items = [];
      state.page = 1;
      state.total = 0;
      state.status = 'idle';
      state.error = null;
    },
    setPage(state, action) {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const payload = action.payload || {};
        if (payload.data && Array.isArray(payload.data.products)) {
          state.items = payload.data.products;
          state.total = payload.metadata?.total ?? payload.total ?? state.total;
          state.metadata = payload.metadata ?? state.metadata;
          state.page = payload.metadata?.currentPage ?? state.page;
        } else if (Array.isArray(payload.products)) {
          state.items = payload.products;
          state.total = payload.total ?? state.total;
        } else if (Array.isArray(payload)) {
          state.items = payload;
        } else if (Array.isArray(payload.data)) {
          state.items = payload.data;
          state.total = payload.total ?? state.total;
        } else if (Array.isArray(payload.items)) {
          state.items = payload.items;
          state.total = payload.total ?? state.total;
        } else {
          state.items = Array.isArray(payload) ? payload : [];
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error;
      });
  },
});

export const { clearProducts, setPage } = productsSlice.actions;

// Selectors
export const selectAllProducts = (state) => state.products.items;
export const selectProductsStatus = (state) => state.products.status;
export const selectProductsError = (state) => state.products.error;
export const selectProductsPage = (state) => state.products.page;
export const selectProductsTotal = (state) => state.products.total;

export default productsSlice.reducer;
