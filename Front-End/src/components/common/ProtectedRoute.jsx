// src/components/common/ProtectedRoutes.jsx
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "./Loader";

const ProtectedRoutes = () => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  // Show loader while checking auth status
  if (loading) return <Loader />;

  // Redirect to login if not authenticated
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // Render nested protected routes
  return <Outlet />;
};

export default ProtectedRoutes;
