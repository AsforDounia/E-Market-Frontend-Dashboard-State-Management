import api from "./api";

export const getAllCoupons = async (params = {}) => {
    try {
        const { data } = await api.get("/coupons", { params });
        return data;
    } catch (error) {
        console.error("Get all coupons error:", error.response?.data);
        throw error;
    }
};

export const createCoupon = async (couponData) => {
    try {
        const { data } = await api.post("/coupons", couponData);
        return data;
    } catch (error) {
        console.error("Create coupon error:", error.response?.data);
        throw error;
    }
};

export const updateCoupon = async (id, couponData) => {
    try {
        const { data } = await api.put(`/coupons/${id}`, couponData);
        return data;
    } catch (error) {
        console.error("Update coupon error:", error.response?.data);
        throw error;
    }
};

export const deleteCoupon = async (id) => {
    try {
        const { data } = await api.delete(`/coupons/${id}`);
        return data;
    } catch (error) {
        console.error("Delete coupon error:", error.response?.data);
        throw error;
    }
};
