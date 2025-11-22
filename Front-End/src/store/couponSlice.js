import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

export const applyCoupon = createAsyncThunk(
  "coupon/applyCoupon",
  async (couponCode, { rejectWithValue }) => {
    try {
      const response = await api.get(`/coupons/code/${couponCode}`);
      return response.data.data.coupon;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Erreur lors de l'application du coupon",
      );
    }
  },
);

const couponSlice = createSlice({
  name: "coupon",
  initialState: {
    appliedCoupon: null,
    loading: false,
    error: null,
  },
  reducers: {
    removeCoupon: (state) => {
      state.appliedCoupon = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(applyCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.appliedCoupon = action.payload;
      })
      .addCase(applyCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.appliedCoupon = null;
      });
  },
});

export const { removeCoupon } = couponSlice.actions;

export default couponSlice.reducer;
