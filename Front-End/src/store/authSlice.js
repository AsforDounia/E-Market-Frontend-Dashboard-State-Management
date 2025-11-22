import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {
  login as loginService,
  register as registerService,
  logout as logoutService,
} from "../services/authService";

// Async thunks for login, register, and logout

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginService(credentials);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      toast.success("Connexion réussie !");
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Erreur de connexion";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  },
);

export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await registerService(userData);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      toast.success("Inscription réussie !");
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Erreur lors de l'inscription";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  },
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await logoutService();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      toast.success("Déconnexion réussie !");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Erreur de déconnexion";
      // Suppress duplicate key error from token blacklist
      if (errorMessage.includes('duplicate key')) {
        // treat as successful logout
        toast.success("Déconnexion réussie !");
        return;
      }
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
    isAuthenticated: !!localStorage.getItem("token"),
  },
  reducers: {
    updateUser: (state, action) => {
      const updatedUser = { ...state.user, ...action.payload };
      state.user = updatedUser;
      localStorage.setItem("user", JSON.stringify(updatedUser));
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateUser } = authSlice.actions;

export default authSlice.reducer;
