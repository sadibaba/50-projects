import api from './api';
import { User } from '@/types';

export const userService = {
  async getUserProfile(id: string): Promise<{
    user: User;
    followersCount: number;
    followingCount: number;
    pins: any[];
    boards: any[];
  }> {
    const response = await api.get(`/users/${id}/profile`);
    return response.data;
  },

  async followUser(id: string): Promise<void> {
    await api.put(`/users/${id}/follow`);
  },

  async unfollowUser(id: string): Promise<void> {
    await api.put(`/users/${id}/unfollow`);
  },
};