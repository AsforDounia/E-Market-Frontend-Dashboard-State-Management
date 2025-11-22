import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser } from "../services/userService";
import { toast } from "react-toastify";

const useDeleteUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteUser,
        onSuccess: () => {
            queryClient.invalidateQueries(["users"]);
            toast.success("User deleted successfully");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to delete user");
        },
    });
};

export default useDeleteUser;
