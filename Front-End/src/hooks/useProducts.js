import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../services/productService";

const useProducts = (filters = {}) => {
    return useQuery({
        queryKey: ["products", filters],
        queryFn: () => getProducts(filters),
        keepPreviousData: true,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export default useProducts;
