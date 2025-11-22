import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "../services/userService";

const useUsers = (filters = {}) => {
    return useQuery({
        queryKey: ["users", filters],
        queryFn: () => getAllUsers(filters),
        keepPreviousData: true,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export default useUsers;
