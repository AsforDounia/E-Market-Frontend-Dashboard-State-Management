import api from "./api";

const reviewService = {
  getReviews: (productId) => api.get(`/reviews/${productId}`),
  createReview: (reviewData) => api.post("/reviews", reviewData),
  deleteReview: (reviewId) => api.delete(`/reviews/${reviewId}`),
  getAllReviews: (params) => api.get("/reviews", { params }),
  updateReviewStatus: (reviewId, status) => api.patch(`/reviews/${reviewId}/status`, { status }),
  reportReview: (reviewId) => api.post(`/reviews/${reviewId}/report`),
};

export default reviewService;
