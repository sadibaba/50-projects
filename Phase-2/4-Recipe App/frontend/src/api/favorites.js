import axios from "axios";

const CLIENT_KEY = "flavorfusion_client_id";

export const getClientId = () => {
  let id = localStorage.getItem(CLIENT_KEY);
  if (!id) {
    id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `client-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    localStorage.setItem(CLIENT_KEY, id);
  }
  return id;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  config.headers["x-client-id"] = getClientId();
  return config;
});

export const getFavorites = async () => {
  const { data } = await api.get("/favorites");
  return data.map((item) => item.meal);
};

export const addFavorite = async (meal) => {
  const { data } = await api.post("/favorites", { meal });
  return data;
};

export const removeFavorite = async (mealId) => {
  await api.delete(`/favorites/${encodeURIComponent(mealId)}`);
};

export const isBackendAvailable = async () => {
  try {
    await api.get("/health");
    return true;
  } catch {
    return false;
  }
};
