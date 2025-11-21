import { Routes, Route } from "react-router-dom";
import Products from "../pages/Products";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";
import PublicRoute from "../components/common/PublicRoute";
import Logout from "../pages/Logout";
import ProtectedRoutes from "../components/common/ProtectedRoute";
import ProductDetails from "../pages/ProductDetails";
import Home from "../pages/Home";
import CreateProduct from "../pages/CreateProduct";
import Checkout from "../pages/Checkout";
import AdminDashboard from "../pages/Admin/Dashboard";
import AdminRoute from "../components/common/AdminRoute";
import AdminProducts from "../pages/Admin/Products";
import AdminUsers from "../pages/Admin/Users";
import AdminCoupons from "../pages/Admin/Coupons";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="product/:id" element={<ProductDetails />} />

      {/* Public routes - redirect if authenticated */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            {" "}
            <Login />{" "}
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            {" "}
            <Register />{" "}
          </PublicRoute>
        }
      />

      {/* Protected routes */}
      <Route element={<ProtectedRoutes />}>
        <Route path="profile" element={<Profile />} />
        <Route path="logout" element={<Logout />} />
        <Route path="products/create" element={<CreateProduct />} />
        <Route path="checkout" element={<Checkout />} />
      </Route>

      {/* Admin routes */}
      <Route element={<AdminRoute />}>
        <Route path="admin/dashboard" element={<AdminDashboard />} />
        <Route path="admin/products" element={<AdminProducts />} />
        <Route path="admin/users" element={<AdminUsers />} />
        <Route path="admin/coupons" element={<AdminCoupons />} />
      </Route>

      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
