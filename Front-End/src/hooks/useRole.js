import { useAuth } from './useAuth';

export const useRole = () => {
  const { user } = useAuth();
  
  return {
    isAdmin: () => user?.role === 'admin',
    isSeller: () => user?.role === 'seller'
  };
};