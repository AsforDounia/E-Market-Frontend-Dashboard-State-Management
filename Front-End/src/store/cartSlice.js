import { createSlice } from "@reduxjs/toolkit";

const items = JSON.parse(localStorage.getItem("cartItems")) || [];

const calculateTotals = (items) => {
  const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);
  const totalAmount = items.reduce((total, item) => total + item.totalPrice, 0);
  return { totalQuantity, totalAmount };
};

const { totalQuantity, totalAmount } = calculateTotals(items);

const initialState = {
  items,
  totalQuantity,
  totalAmount,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.items.find((item) => item._id === product._id);

      state.totalQuantity += quantity;

      if (!existingItem) {
        state.items.push({
          ...product,
          quantity: quantity,
          totalPrice: product.price * quantity,
        });
      } else {
        existingItem.quantity += quantity;
        existingItem.totalPrice += product.price * quantity;
      }
      state.totalAmount = state.items.reduce(
        (total, item) => total + item.totalPrice,
        0,
      );
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      const existingItem = state.items.find((item) => item._id === id);
      if (existingItem) {
        state.totalQuantity -= existingItem.quantity;
        state.items = state.items.filter((item) => item._id !== id);
      }
      state.totalAmount = state.items.reduce(
        (total, item) => total + item.totalPrice,
        0,
      );
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const existingItem = state.items.find((item) => item._id === id);
      if (existingItem) {
        state.totalQuantity += quantity - existingItem.quantity;
        existingItem.quantity = quantity;
        existingItem.totalPrice = existingItem.price * quantity;
      }
      if (existingItem.quantity <= 0) {
        state.items = state.items.filter((item) => item._id !== id);
      }
      state.totalAmount = state.items.reduce(
        (total, item) => total + item.totalPrice,
        0,
      );
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      localStorage.removeItem("cartItems");
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
