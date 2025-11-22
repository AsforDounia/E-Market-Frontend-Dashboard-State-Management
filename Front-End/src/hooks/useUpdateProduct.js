import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProduct } from "../services/productService";
import { toast } from "react-toastify";

const useUpdateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => updateProduct(id, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries(["products"]);
            queryClient.invalidateQueries(["product", variables.id]);
            toast.success("Product updated successfully");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to update product");
        },
    });
};

export default useUpdateProduct;
