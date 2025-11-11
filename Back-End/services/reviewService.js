import { Review } from "../models/Index.js";
export const getReviewsForProduct = async (productId) => {
  const reviews = await Review.find({ productId, deletedAt: null }).populate('userId', 'fullname').sort({ createdAt: -1 });

  const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
  const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

  return {
    reviews,
    averageRating: Math.round(averageRating * 10) / 10, // round to 1 decimal
    count: reviews.length,
  };
};
