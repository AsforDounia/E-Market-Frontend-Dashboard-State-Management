import { useQuery } from "@tanstack/react-query";
import reviewService from "../services/reviewService";

const useReviews = (productId) => {
  return useQuery({
    queryKey: ["reviews", productId],
    queryFn: async () => {
      const response = await reviewService.getReviews(productId);
      return response.data;
    },
    enabled: !!productId,
  });
};

export default useReviews;
