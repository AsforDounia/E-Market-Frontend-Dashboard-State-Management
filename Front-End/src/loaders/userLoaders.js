import api from '../services/api';

// Loader for user profile data
export const profileLoader = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return { profile: null, orders: null };
    }
    
    const [profileResponse, ordersResponse] = await Promise.all([
      api.get('/users/profile'),
      api.get('/orders')
    ]);
    
    return {
      profile: profileResponse.data,
      orders: ordersResponse.data
    };
  } catch (error) {
    console.error('Profile loader error:', error);
    return { profile: null, orders: null };
  }
};