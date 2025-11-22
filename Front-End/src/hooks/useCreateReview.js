import { useMutation, useQueryClient } from "@tanstack/react-query";
import reviewService from "../services/reviewService";
import { toast } from "react-toastify";

const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewData) => reviewService.createReview(reviewData),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["reviews", data.data.review.productId]);
      toast.success("Review created successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Error creating review");
    },
  });
};

export default useCreateReview;
