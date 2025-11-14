import api from '../services/api';

// Loader for products list
export const productsLoader = async () => {
  try {
    const response = await api.get('/products');
    return response.data;
  } catch (error) {
    console.error('Products loader error:', error);
    return { data: { products: [] }, metadata: {} };
  }
};

// Loader for single product details
export const productDetailsLoader = async ({ params }) => {
  try {
    const response = await api.get(`/products/${params.slug}`);
    return response.data;
  } catch (error) {
    console.error('Product details loader error:', error);
    if (error.response?.status === 404) {
      throw new Response('Product not found', { status: 404 });
    }
    return null;
  }
};