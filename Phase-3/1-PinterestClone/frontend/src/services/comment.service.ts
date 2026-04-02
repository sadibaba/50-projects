import api from './api';
import { Comment } from '@/types';

export const commentService = {
  async getComments(pinId: string): Promise<Comment[]> {
    const response = await api.get(`/pins/${pinId}/comments`);
    return response.data;
  },

  async addComment(pinId: string, text: string): Promise<Comment> {
    const response = await api.post(`/pins/${pinId}/comments`, { text });
    return response.data.comment;
  },

  async deleteComment(commentId: string): Promise<void> {
    await api.delete(`/comments/${commentId}`);
  },
};