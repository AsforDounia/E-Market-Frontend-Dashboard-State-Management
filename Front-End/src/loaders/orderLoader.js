import api from '../services/api';

// Loader for orders list
export const ordersLoader = async () => {
  try {
    const response = await api.get('/orders');
    return response.data;
  } catch (error) {
    console.error('Orders loader error:', error);
    return { data: { orders: [] }, metadata: {} };
  }
};

// Loader for single order details
export const orderDetailsLoader = async ({ params }) => {
  try {
    const response = await api.get(`/orders/${params.id}`);
    return response.data;
  } catch (error) {
    console.error('Order details loader error:', error);
    if (error.response?.status === 404) {
      throw new Response('Order not found', { status: 404 });
    }
    return null;
  }
};
