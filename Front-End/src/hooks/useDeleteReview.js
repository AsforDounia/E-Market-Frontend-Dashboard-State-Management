import { useMutation, useQueryClient } from "@tanstack/react-query";
import reviewService from "../services/reviewService";
import { toast } from "react-toastify";

const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId) => reviewService.deleteReview(reviewId),
    onSuccess: (data, reviewId) => {
      // We don't know the productId from the delete response,
      // so we might need to invalidate all reviews queries
      // or pass productId to the mutation.
      // For now, let's refetch all reviews.
      queryClient.invalidateQueries(["reviews"]);
      toast.success("Review deleted successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Error deleting review");
    },
  });
};

export default useDeleteReview;
