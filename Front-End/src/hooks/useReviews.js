import { useQuery } from "@tanstack/react-query";
import reviewService from "../services/reviewService";

const useReviews = (productId) => {
  return useQuery({
    queryKey: ["reviews", productId],
    queryFn: () => reviewService.getReviews(productId),
    enabled: !!productId,
  });
};

export default useReviews;
