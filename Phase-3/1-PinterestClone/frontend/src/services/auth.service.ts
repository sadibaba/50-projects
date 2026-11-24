import api from "./api";

export const authService = {
  async login(data: { email: string; password: string }) {
    const response = await api.post("/auth/login", data);
    return response.data;
  },
  async register(data: { username: string; email: string; password: string }) {
    const response = await api.post("/auth/register", data);
    return response.data;
  },
  async me() {
    const response = await api.get("/auth/me");
    return response.data;
  },
  async updateMe(data: Record<string, unknown>) {
    const response = await api.put("/auth/me", data);
    return response.data;
  },
  async changePassword(data: { currentPassword: string; newPassword: string }) {
    const response = await api.put("/auth/me/password", data);
    return response.data;
  },
};
