import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrder } from "../services/orderService";
import { toast } from "react-toastify";

const useCreateOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createOrder,
        onSuccess: () => {
            queryClient.invalidateQueries(["orders"]);
            toast.success("Order created successfully");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to create order");
        },
    });
};

export default useCreateOrder;
