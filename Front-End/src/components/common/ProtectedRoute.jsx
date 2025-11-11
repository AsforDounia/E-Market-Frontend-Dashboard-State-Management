// src/components/common/ProtectedRoutes.jsx
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Loader from './Loader';

const ProtectedRoutes = () => {
  const { isAuthenticated, loading } = useAuth();

  // Show loader while checking auth status
  if (loading) return <Loader />;

  // Redirect to login if not authenticated
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // Render nested protected routes
  return <Outlet />;
};

export default ProtectedRoutes;
