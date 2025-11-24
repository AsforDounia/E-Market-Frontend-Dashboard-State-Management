import { Routes, Route, Navigate } from "react-router-dom";
import Products from "../pages/Products";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";
import Forbidden from "../pages/Forbidden";
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
import AdminOrders from "../pages/Admin/Orders";
import SellerRoute from "../components/common/SellerRoute";
import SellerDashboard from "../pages/Seller/Dashboard";
import SellerProducts from "../pages/Seller/SellerProducts";
import SellerCoupons from "../pages/Seller/SellerCoupons";
import EditProduct from "../pages/EditProduct";
import AdminReviews from "../pages/Admin/AdminReviews";
import Orders from "../pages/Orders";
import OrderDetails from "../pages/OrderDetails";

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
        <Route path="orders" element={<Orders />} />
        <Route path="order/:id" element={<OrderDetails />} />
      </Route>

      {/* Admin routes */}
      <Route element={<AdminRoute />}>
        <Route path="admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="admin/dashboard" element={<AdminDashboard />} />
        <Route path="admin/products" element={<AdminProducts />} />
        <Route path="admin/users" element={<AdminUsers />} />
        <Route path="admin/reviews" element={<AdminReviews />} />
        <Route path="admin/coupons" element={<AdminCoupons />} />
        <Route path="admin/orders" element={<AdminOrders />} />
      </Route>

      {/* Seller routes */}
      <Route element={<SellerRoute />}>
        <Route path="seller" element={<Navigate to="/seller/dashboard" replace />} />
        <Route path="seller/dashboard" element={<SellerDashboard />} />
        <Route path="seller/products" element={<SellerProducts />} />
        <Route path="seller/coupons" element={<SellerCoupons />} />
        <Route path="products/edit/:id" element={<EditProduct />} />
      </Route>

      {/* 403 Forbidden */}
      <Route path="/forbidden" element={<Forbidden />} />

      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
