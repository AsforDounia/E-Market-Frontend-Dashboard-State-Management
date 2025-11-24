import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";
import { clearCart } from "./cartSlice";

// --- Thunks ---

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (params = {}, thunkAPI) => {
    try {
      const response = await api.get('/orders', { params });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (orderId, thunkAPI) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

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

export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async (orderId, thunkAPI) => {
    try {
      const response = await api.delete(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

// --- Slice ---

const initialState = {
  items: [],
  currentOrder: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  loading: false, // Keeping for backward compatibility if used elsewhere
  error: null,
  page: 1,
  total: 0,
  metadata: {},
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearOrders(state) {
      state.items = [];
      state.currentOrder = null;
      state.page = 1;
      state.total = 0;
      state.status = 'idle';
      state.loading = false;
      state.error = null;
    },
    setPage(state, action) {
      state.page = action.payload;
    },
    setCurrentOrder(state, action) {
      state.currentOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchOrders
      .addCase(fetchOrders.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.loading = false;
        const payload = action.payload || {};
        // Support different shapes returned by API
        if (payload.data && Array.isArray(payload.data.orders)) {
          state.items = payload.data.orders;
          state.total = payload.metadata?.total ?? state.total;
          state.metadata = payload.metadata ?? state.metadata;
          state.page = payload.metadata?.currentPage ?? state.page;
        } else if (Array.isArray(payload.orders)) {
          state.items = payload.orders;
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
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload || action.error;
      })
      // fetchOrderById
      .addCase(fetchOrderById.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.loading = false;
        // Handle the nested data structure from backend
        const orderData = action.payload?.data?.order ?? action.payload?.data ?? action.payload;
        state.currentOrder = orderData;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload || action.error;
      })
      // createOrder
      .addCase(createOrder.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.loading = false;
        const newOrder = action.payload?.data?.order ?? action.payload?.data ?? action.payload;
        if (newOrder) {
          state.currentOrder = newOrder;
          // Optionally add to items if needed, but usually we redirect
          // state.items.unshift(newOrder);
        }
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      })
      // payForOrder
      .addCase(payForOrder.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(payForOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.loading = false;
        // The status update is handled by updateOrderStatus
      })
      .addCase(payForOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      })
      // updateOrderStatus
      .addCase(updateOrderStatus.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.loading = false;
        const updatedOrder = action.payload?.data?.order ?? action.payload?.data ?? action.payload;
        state.currentOrder = updatedOrder;
        const index = state.items.findIndex(o => o._id === updatedOrder._id || o.orderId === updatedOrder.orderId);
        if (index !== -1) {
          state.items[index] = updatedOrder;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      })
      // cancelOrder
      .addCase(cancelOrder.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.loading = false;
        const cancelledOrder = action.payload?.data?.order ?? action.payload?.data ?? action.payload;
        if (cancelledOrder) {
          // Update current order if it matches
          if (state.currentOrder?._id === cancelledOrder._id) {
            state.currentOrder = cancelledOrder;
          }
          // Update in items list
          const index = state.items.findIndex(order => order._id === cancelledOrder._id);
          if (index !== -1) {
            state.items[index] = cancelledOrder;
          }
        }
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload || action.error;
      });
  },
});

export const { clearOrders, setPage, setCurrentOrder } = ordersSlice.actions;

// Selectors
export const selectAllOrders = (state) => state.orders.items;
export const selectOrdersStatus = (state) => state.orders.status;
export const selectOrdersError = (state) => state.orders.error;
export const selectOrdersPage = (state) => state.orders.page;
export const selectOrdersTotal = (state) => state.orders.total;
export const selectCurrentOrder = (state) => state.orders.currentOrder;

export default ordersSlice.reducer;
