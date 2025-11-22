// src/components/common/AdminRoute.jsx
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "./Loader";

const AdminRoute = () => {
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);

  // Show loader while checking auth status
  if (loading) return <Loader />;

  // Redirect to login if not authenticated
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // Redirect to home if not an admin
  if (user?.role !== "admin") return <Navigate to="/forbidden" replace />;

  // Render nested admin routes
  return <Outlet />;
};

export default AdminRoute;
