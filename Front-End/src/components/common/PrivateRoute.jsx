import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Loader from './Loader';

const PrivateRoute = ({ children, roles = [] }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) return <Loader />;
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  if (roles.length > 0 && !roles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default PrivateRoute;