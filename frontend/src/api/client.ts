import axios from "axios";

export const apiClient = axios.create({
    baseURL: "https://ecosystems-exam-1.vercel.app"
});

apiClient.interceptors.request.use(
    (config) => {
        // Renombrado para mayor claridad y corrección del typo en "access_token"
        const accessToken = localStorage.getItem("access_token");

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const getCurrentUser = () => {
    // Renombrado para indicar que es el string crudo almacenado
    const storedUserString = localStorage.getItem("user");
    
    if (!storedUserString) return null;

    try {
        return JSON.parse(storedUserString);
    } catch {
        return null;
    }
};