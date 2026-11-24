import api from "./api";
import { FreeImage, Pin } from "@/types";

export const discoverService = {
  async categories() {
    const response = await api.get("/discover/categories");
    return response.data as { name: string; count: number }[];
  },
  async images(params: { q?: string; page?: number; limit?: number }) {
    const response = await api.get("/discover/images", { params });
    return response.data as { results: FreeImage[]; page: number; hasMore: boolean; source: string };
  },
  async search(q: string) {
    const response = await api.get("/search", { params: { q } });
    return response.data as { pins: Pin[]; boards: unknown[]; users: unknown[] };
  },
  async upload(file: File) {
    const form = new FormData();
    form.append("image", file);
    const response = await api.post("/upload", form);
    return response.data as { url: string };
  },
};
