import { useQuery } from "@tanstack/react-query";
import { getProductById } from "../services/productService";

const useProduct = (id) => {
    return useQuery({
        queryKey: ["product", id],
        queryFn: () => getProductById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export default useProduct;
