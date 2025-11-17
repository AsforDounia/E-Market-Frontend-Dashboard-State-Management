import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Loader from './Loader';

const RoleGuard = ({ children, allowedRoles, redirectTo = '/unauthorized' }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <Loader />;
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default RoleGuard;