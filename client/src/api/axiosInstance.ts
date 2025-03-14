import axios, { AxiosInstance, AxiosResponse } from "axios";

// Define a type for the response data structure
export interface ApiResponse<T> {
    success: string;
    message: string;
    data: T;
}

// Create the axios instance
const axiosInstance: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 5000,
});

// Request Interceptor
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response Interceptor
axiosInstance.interceptors.response.use(
    (response: AxiosResponse<ApiResponse<unknown>>) => {
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
