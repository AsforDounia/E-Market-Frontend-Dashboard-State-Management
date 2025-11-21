import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { getProducts } from "../services/productService";

// Async thunk for fetching products
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const data = await getProducts(filters);
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to fetch products";
      toast.error(errorMessage);
      return rejectWithValue(error.response.data);
    }
  },
);

const productsSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    metadata: {
      total: 0,
      currentPage: 1,
      totalPages: 1,
      pageSize: 8,
      hasNextPage: false,
      hasPreviousPage: false,
    },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.data.products;
        state.metadata = action.payload.metadata;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Failed to fetch products";
      });
  },
});

export default productsSlice.reducer;
