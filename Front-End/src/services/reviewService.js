import api from "./api";

const reviewService = {
  getReviews: (productId) => api.get(`/reviews/${productId}`),
  createReview: (reviewData) => api.post("/reviews", reviewData),
  deleteReview: (reviewId) => api.delete(`/reviews/${reviewId}`),
};

export default reviewService;
