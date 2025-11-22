import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import api from "../services/api.js";

export const fetchCategories = createAsyncThunk(
  "categories/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/categories");
      // Server returns: { success, message, data: { categoryIds: [...] } }
      const raw = res?.data?.data?.categoryIds;
      console.log(raw);
      if (Array.isArray(raw)) return raw;
      return [];
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message ||
        err.message ||
        "Failed to fetch categories";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  },
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState: {
    items: [],
    loading: false,
    error: null,
    fetched: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.fetched = true;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error fetching categories";
      });
  },
});

export default categoriesSlice.reducer;
