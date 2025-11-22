import { useSelector } from 'react-redux';

export const useAuth = () => {
  const { isAuthenticated, user, token, loading, error } = useSelector(state => state.auth);
  return { isAuthenticated, user, token, loading, error };
};
