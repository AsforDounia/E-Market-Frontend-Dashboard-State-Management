import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";
import { clearCart } from "./cartSlice";

export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (orderData, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/orders", orderData);
      // After successfully creating the order, clear the cart.
      dispatch(clearCart());
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Erreur lors de la création de la commande",
      );
    }
  },
);

export const getOrders = createAsyncThunk(
  "orders/getOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/orders");
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Erreur lors de la récupération des commandes",
      );
    }
  },
);

export const payForOrder = createAsyncThunk(
  "orders/payForOrder",
  async (orderId, { dispatch, rejectWithValue }) => {
    try {
      // 1. Call the mock checkout endpoint
      await api.post("/orders/checkout"); // This will succeed or fail randomly

      // 2. If it succeeds, update the order status to 'paid'
      // We dispatch and wait for the result of updateOrderStatus
      const resultAction = await dispatch(updateOrderStatus({ orderId, status: "paid" }));
      if (updateOrderStatus.rejected.match(resultAction)) {
        return rejectWithValue(resultAction.payload);
      }

      return { orderId, paidOrder: resultAction.payload };
    } catch (err) {
      // The checkout failed
      return rejectWithValue(
        err.response?.data?.message || "Payment failed"
      );
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/orders/${orderId}`, { status });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update order status"
      );
    }
  }
);


const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    loading: false,
    error: null,
    currentOrder: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload.data.order;
        // Optionally, add the new order to the list of orders
        // state.orders.push(action.payload.data.order);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.data.orders;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(payForOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(payForOrder.fulfilled, (state, action) => {
        state.loading = false;
        // The status update is handled by updateOrderStatus, which is dispatched from payForOrder.
        // The fulfilled action of updateOrderStatus will update the state.
      })
      .addCase(payForOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateOrderStatus.pending, (state) => {
        // Can use a specific loading state if needed, e.g., state.updatingStatus = true
        state.loading = true;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedOrder = action.payload.data.order;
        state.currentOrder = updatedOrder;
        const index = state.orders.findIndex(o => o.orderId === updatedOrder.orderId);
        if (index !== -1) {
            state.orders[index] = updatedOrder;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default ordersSlice.reducer;
