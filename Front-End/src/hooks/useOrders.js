import { useQuery } from "@tanstack/react-query";
import { getOrders } from "../services/orderService";

const useOrders = (filters = {}) => {
    return useQuery({
        queryKey: ["orders", filters],
        queryFn: () => getOrders(filters),
        keepPreviousData: true,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export default useOrders;
