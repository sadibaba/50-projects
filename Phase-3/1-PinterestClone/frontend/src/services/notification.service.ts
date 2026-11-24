import api from "./api";
import { Notification } from "@/types";

export const notificationService = {
  async list() {
    const response = await api.get("/notifications");
    return response.data as { notifications: Notification[]; unread: number };
  },
  async markRead(id: string) {
    await api.put(`/notifications/${id}/read`);
  },
  async markAllRead() {
    await api.put("/notifications/read-all");
  },
};
