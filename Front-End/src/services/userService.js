import api from "./api";

export const getAllUsers = async (params = {}) => {
    try {
        const { data } = await api.get("/users", { params });
        return data;
    } catch (error) {
        console.error("Get all users error:", error.response?.data);
        throw error;
    }
};

export const updateUserRole = async (id, role) => {
    try {
        const { data } = await api.patch(`/users/${id}/role`, { role });
        return data;
    } catch (error) {
        console.error("Update user role error:", error.response?.data);
        throw error;
    }
};

export const deleteUser = async (id) => {
    try {
        const { data } = await api.delete(`/users/${id}`);
        return data;
    } catch (error) {
        console.error("Delete user error:", error.response?.data);
        throw error;
    }
};
