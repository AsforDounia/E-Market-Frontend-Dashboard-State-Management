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
import Cart from "../pages/Cart";

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
        <Route path="cart" element={<Cart />} />
      </Route>

      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
