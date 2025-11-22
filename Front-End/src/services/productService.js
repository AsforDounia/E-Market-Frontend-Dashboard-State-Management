import api from "./api";

export const getProducts = async (filters = {}) => {
    try {
        const { data } = await api.get("/products", { params: filters });
        return data;
    } catch (error) {
        console.error("Get products error:", error.response?.data);
        throw error;
    }
};

export const getPendingProducts = async () => {
    try {
        const { data } = await api.get("/products/pending");
        return data;
    } catch (error) {
        console.error("Get pending products error:", error.response?.data);
        throw error;
    }
};

export const validateProduct = async (id) => {
    try {
        const { data } = await api.patch(`/products/${id}/validate`);
        return data;
    } catch (error) {
        console.error("Validate product error:", error.response?.data);
        throw error;
    }
};

export const rejectProduct = async (id) => {
    try {
        const { data } = await api.patch(`/products/${id}/reject`);
        return data;
    } catch (error) {
        console.error("Reject product error:", error.response?.data);
        throw error;
    }
};

export const deleteProduct = async (id) => {
    try {
        const { data } = await api.delete(`/products/${id}`);
        return data;
    } catch (error) {
        console.error("Delete product error:", error.response?.data);
        throw error;
    }
};
export const getProductById = async (id) => {
    try {
        const { data } = await api.get(`/products/${id}`);
        return data;
    } catch (error) {
        console.error("Get product by id error:", error.response?.data);
        throw error;
    }
};

export const createProduct = async (productData) => {
    try {
        const { data } = await api.post("/products", productData);
        return data;
    } catch (error) {
        console.error("Create product error:", error.response?.data);
        throw error;
    }
};

export const updateProduct = async (id, productData) => {
    try {
        const { data } = await api.put(`/products/${id}`, productData);
        return data;
    } catch (error) {
        console.error("Update product error:", error.response?.data);
        throw error;
    }
};
