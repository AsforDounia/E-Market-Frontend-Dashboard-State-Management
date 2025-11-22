import api from "./api";

export const getOrders = async (filters = {}) => {
    try {
        const { data } = await api.get("/orders", { params: filters });
        return data;
    } catch (error) {
        console.error("Get orders error:", error.response?.data);
        throw error;
    }
};

export const createOrder = async (orderData) => {
    try {
        const { data } = await api.post("/orders", orderData);
        return data;
    } catch (error) {
        console.error("Create order error:", error.response?.data);
        throw error;
    }
};

export const updateOrder = async (id, orderData) => {
    try {
        const { data } = await api.put(`/orders/${id}`, orderData);
        return data;
    } catch (error) {
        console.error("Update order error:", error.response?.data);
        throw error;
    }
};
