import api from './api';
import { Comment } from '@/types';

export const commentService = {
  async getComments(pinId: string): Promise<Comment[]> {
    const response = await api.get(`/pins/${pinId}/comments`);
    return Array.isArray(response.data) ? response.data : [];
  },

  async addComment(pinId: string, text: string): Promise<Comment> {
    const response = await api.post(`/pins/${pinId}/comments`, { text });
    return response.data.comment || response.data;
  },

  async deleteComment(commentId: string): Promise<void> {
    await api.delete(`/comments/${commentId}`);
  },
};