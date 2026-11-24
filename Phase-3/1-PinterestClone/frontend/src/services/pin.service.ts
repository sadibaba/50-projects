import api from "./api";
import { Pin } from "@/types";

export const pinService = {
  async list(params: Record<string, string | number | undefined>) {
    const response = await api.get("/pins", { params });
    return response.data as { pins: Pin[]; page: number; total: number; hasMore: boolean };
  },
  async get(id: string) {
    const response = await api.get(`/pins/${id}`);
    return response.data as Pin;
  },
  async create(data: Record<string, unknown>) {
    const response = await api.post("/pins", data);
    return response.data as Pin;
  },
  async update(id: string, data: Record<string, unknown>) {
    const response = await api.put(`/pins/${id}`, data);
    return response.data as Pin;
  },
  async remove(id: string) {
    await api.delete(`/pins/${id}`);
  },
  async like(id: string) {
    const response = await api.put(`/pins/${id}/like`);
    return response.data as { liked: boolean; likesCount: number };
  },
  async unlike(id: string) {
    const response = await api.put(`/pins/${id}/unlike`);
    return response.data as { liked: boolean; likesCount: number };
  },
  async save(id: string, boardId?: string) {
    const response = await api.put(`/pins/${id}/save`, { boardId });
    return response.data as { saved: boolean; savesCount: number };
  },
  async unsave(id: string) {
    const response = await api.put(`/pins/${id}/unsave`);
    return response.data as { saved: boolean; savesCount: number };
  },
};
