import API from "./api";

export const signup = (data) => API.post("/auth/signup", data);

export const login = async (data) => {
  const res = await API.post("/auth/login", data);
  if (res.data.token) localStorage.setItem("token", res.data.token);
  return res;
};

export const logout = () => {
  localStorage.removeItem("token");
  return API.post("/auth/logout");
};

export const getProfile = () => API.get("/auth/me");

export const updateProfile = (data) => API.put("/auth/me", data);

export const changePassword = (data) => API.put("/auth/me/password", data);

export const getAdminStats = () => API.get("/auth/admin/stats");

export const getAllUsers = (params = {}) =>
  API.get("/auth/admin/users", { params });

export const deleteUser = (id) => API.delete(`/auth/admin/users/${id}`);
