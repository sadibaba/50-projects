import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Example: Fetch todos using the api instance
const fetchTodos = async () => {
  try {
    const res = await api.get("/todos"); // use api instead of axios
    setTodos(res.data);
  } catch (err) {
    console.error("Error fetching todos:", err);
  }
};

export { api, fetchTodos };