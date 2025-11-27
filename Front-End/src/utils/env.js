export const getEnv = (key) => {
    return import.meta.env[key];
};

export const API_URL = import.meta.env.VITE_API_URL;
