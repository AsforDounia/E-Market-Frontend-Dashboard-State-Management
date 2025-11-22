import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOrder } from "../services/orderService";
import { toast } from "react-toastify";

const useUpdateOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => updateOrder(id, data),
        onMutate: async ({ id, data }) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries(["orders"]);

            // Snapshot the previous value
            const previousOrders = queryClient.getQueryData(["orders"]);

            // Optimistically update to the new value
            if (previousOrders) {
                queryClient.setQueryData(["orders"], (old) => {
                    if (!old || !old.data || !old.data.orders) return old;
                    return {
                        ...old,
                        data: {
                            ...old.data,
                            orders: old.data.orders.map(order =>
                                order._id === id ? { ...order, ...data } : order
                            )
                        }
                    };
                });
            }

            // Return a context object with the snapshotted value
            return { previousOrders };
        },
        onError: (err, newOrder, context) => {
            queryClient.setQueryData(["orders"], context.previousOrders);
            toast.error(err.response?.data?.message || "Failed to update order");
        },
        onSettled: () => {
            queryClient.invalidateQueries(["orders"]);
        },
        onSuccess: () => {
            toast.success("Order updated successfully");
        }
    });
};

export default useUpdateOrder;
