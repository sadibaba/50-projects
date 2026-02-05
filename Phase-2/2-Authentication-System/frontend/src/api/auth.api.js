import API from "./api";

/* ===== Signup ===== */
export const signup = (data) => {
  return API.post("/auth/signup", data);
};

/* ===== Login ===== */
export const login = async (data) => {
  const res = await API.post("/auth/login", data);

  // token ko store karo
  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
  }

  return res;
};

/* ===== Logout ===== */
export const logout = () => {
  localStorage.removeItem("token");
  return API.post("/auth/logout");
};

/* ===== Get Profile ===== */
export const getProfile = () => {
  return API.get("/auth/me");
};

/* ===== Admin: Get All Users ===== */
export const getAllUsers = () => {
  return API.get("/auth/admin/users");
};

/* ===== Admin: Delete User ===== */
export const deleteUser = (id) => {
  return API.delete(`/auth/admin/users/${id}`);
};
