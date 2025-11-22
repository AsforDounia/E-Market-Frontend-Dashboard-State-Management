import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProduct } from "../services/productService";
import { toast } from "react-toastify";

const useDeleteProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteProduct,
        onSuccess: () => {
            queryClient.invalidateQueries(["products"]);
            toast.success("Product deleted successfully");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to delete product");
        },
    });
};

export default useDeleteProduct;
