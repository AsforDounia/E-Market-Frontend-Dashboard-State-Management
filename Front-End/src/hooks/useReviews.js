import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import reviewService from "../services/reviewService";

const useReviews = (productId) => {
  const queryClient = useQueryClient();

  const reviewsQuery = useQuery({
    queryKey: ["reviews", productId],
    queryFn: async () => {
      const response = await reviewService.getReviews(productId);
      return response.data;
    },
    enabled: !!productId,
  });

  const deleteReviewMutation = useMutation({
    mutationFn: (reviewId) => reviewService.deleteReview(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries(["reviews", productId]);
    },
  });

  return {
    ...reviewsQuery,
    deleteReview: deleteReviewMutation.mutateAsync,
    isDeleting: deleteReviewMutation.isPending,
  };
};

export default useReviews;
