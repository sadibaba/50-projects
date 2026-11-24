import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || error.message || "Something went wrong";
    error.message = message;
    if (error.response?.status === 401 && typeof window !== "undefined" && localStorage.getItem("token")) {
      localStorage.removeItem("token");
      localStorage.removeItem("current_user");
    }
    return Promise.reject(error);
  }
);

export default api;
