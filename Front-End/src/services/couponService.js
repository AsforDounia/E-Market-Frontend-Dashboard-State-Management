import api from './api';

export const couponService = {
  getAllCoupons: (params = {}) => api.get('/coupons', { params }),
  createCoupon: (couponData) => api.post('/coupons', couponData),
  updateCoupon: (id, couponData) => api.put(`/coupons/${id}`, couponData),
  deleteCoupon: (id) => api.delete(`/coupons/${id}`),
  getCouponById: (id) => api.get(`/coupons/${id}`)
};