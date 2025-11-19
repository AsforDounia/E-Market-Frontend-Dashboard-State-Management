import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

// Thunks
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (params = {}, thunkAPI) => {
    try {
      const response = await api.get('/orders', { params });
    console.log("order data", response.data)
      
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
  'orders/createOrder',
  async (payload, thunkAPI) => {
    try {
      const response = await api.post('/orders', payload);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: error.message }
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

const initialState = {
  items: [],
  currentOrder: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  page: 1,
  total: 0,
  metadata: {},
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrders(state) {
      state.items = [];
      state.currentOrder = null;
      state.page = 1;
      state.total = 0;
      state.status = 'idle';
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
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
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
        state.error = action.payload || action.error;
      })
      // fetchOrderById
      .addCase(fetchOrderById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Handle the nested data structure from backend
        const orderData = action.payload?.data?.order ?? action.payload?.data ?? action.payload;
        state.currentOrder = orderData;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error;
      })
      // createOrder
      .addCase(createOrder.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const newOrder = action.payload?.data ?? action.payload;
        if (newOrder) {
          state.items.unshift(newOrder);
          state.currentOrder = newOrder;
        }
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error;
      })
      // cancelOrder
      .addCase(cancelOrder.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
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
        state.error = action.payload || action.error;
      });
  },
});

export const { clearOrders, setPage, setCurrentOrder } = orderSlice.actions;

// Selectors
export const selectAllOrders = (state) => state.orders.items;
export const selectOrdersStatus = (state) => state.orders.status;
export const selectOrdersError = (state) => state.orders.error;
export const selectOrdersPage = (state) => state.orders.page;
export const selectOrdersTotal = (state) => state.orders.total;
export const selectCurrentOrder = (state) => state.orders.currentOrder;

export default orderSlice.reducer;
