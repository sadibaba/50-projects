import api from "./api";
import { Comment } from "@/types";

export const commentService = {
  async list(pinId: string) {
    const response = await api.get(`/pins/${pinId}/comments`);
    return response.data as Comment[];
  },
  async add(pinId: string, text: string) {
    const response = await api.post(`/pins/${pinId}/comments`, { text });
    return response.data as Comment;
  },
  async remove(id: string) {
    await api.delete(`/comments/${id}`);
  },
};
