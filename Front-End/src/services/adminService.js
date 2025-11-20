// Front-End/src/services/adminService.js
import api from "./api";

export const getLogs = async () => {
    try {
        const response = await api.get("/admin/logs");
        return response.data;
    } catch (error) {
        console.error("Get logs error:", error.response?.data);
        throw error;
    }
};
