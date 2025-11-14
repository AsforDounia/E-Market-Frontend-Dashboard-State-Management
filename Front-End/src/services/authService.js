import api from "./api";

// Fonction de connexion
export const login = async (credentials) => {
  try {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  } catch (error) {
    console.error("Login error:", error.response?.data);
    throw error;
  }
};

// Fonction de déconnexion
export const logout = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.post("/auth/logout", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

// Fonction d'inscription
export const register = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    console.error("Register error:", error.response?.data);
    throw error;
  }
};

// Fonction pour obtenir le profil utilisateur
export const getProfile = async () => {
  try {
    const response = await api.get("/users/profile");
    return response.data;
  } catch (error) {
    console.error("Get profile error:", error);
    throw error;
  }
};
