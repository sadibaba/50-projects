import api from "./api";
import { Board } from "@/types";

export const boardService = {
  async list(params: Record<string, string | number | undefined>) {
    const response = await api.get("/boards", { params });
    return response.data as Board[];
  },
  async get(id: string) {
    const response = await api.get(`/boards/${id}`);
    return response.data as Board;
  },
  async create(data: Record<string, unknown>) {
    const response = await api.post("/boards", data);
    return response.data as Board;
  },
  async update(id: string, data: Record<string, unknown>) {
    const response = await api.put(`/boards/${id}`, data);
    return response.data as Board;
  },
  async remove(id: string) {
    await api.delete(`/boards/${id}`);
  },
  async addPin(id: string, pinId: string) {
    const response = await api.post(`/boards/${id}/pins`, { pinId });
    return response.data as Board;
  },
  async removePin(id: string, pinId: string) {
    const response = await api.delete(`/boards/${id}/pins/${pinId}`);
    return response.data as Board;
  },
};
