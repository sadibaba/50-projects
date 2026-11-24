import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 15000,
});

export const getToken = () =>
  localStorage.getItem("token") || sessionStorage.getItem("token");

export const saveSession = (token, user, remember) => {
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem("token", token);
  if (user) storage.setItem("user", JSON.stringify(user));
  (remember ? sessionStorage : localStorage).removeItem("token");
};

export const clearSession = () => {
  for (const storage of [localStorage, sessionStorage]) {
    storage.removeItem("token");
    storage.removeItem("user");
  }
};

export const getStoredUser = () => {
  const raw =
    localStorage.getItem("user") || sessionStorage.getItem("user") || null;
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && getToken()) {
      clearSession();
      if (window.location.pathname !== "/login") window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
