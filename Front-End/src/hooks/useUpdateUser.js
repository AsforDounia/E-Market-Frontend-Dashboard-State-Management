import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserRole } from "../services/userService";
import { toast } from "react-toastify";

const useUpdateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, role }) => updateUserRole(id, role),
        onSuccess: () => {
            queryClient.invalidateQueries(["users"]);
            toast.success("User role updated successfully");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to update user role");
        },
    });
};

export default useUpdateUser;
