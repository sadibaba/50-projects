import axios from "axios";

const API = axios.create({
  baseURL: "/api", 
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    
    if (error.code === "ECONNABORTED") {
      return Promise.reject(new Error("Request timeout. Please check your internet connection."));
    }
    
    if (!error.response) {
      return Promise.reject(new Error("Cannot connect to server. Please check if backend is running."));
    }
    
    if (error.response.status === 401) {
      localStorage.removeItem("token");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    
    return Promise.reject(error);
  }
);

export default API;