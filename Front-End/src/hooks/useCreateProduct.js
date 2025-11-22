import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct } from "../services/productService";
import { toast } from "react-toastify";

const useCreateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createProduct,
        onSuccess: () => {
            queryClient.invalidateQueries(["products"]);
            toast.success("Product created successfully");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to create product");
        },
    });
};

export default useCreateProduct;
