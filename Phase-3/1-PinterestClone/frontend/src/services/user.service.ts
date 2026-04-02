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
    const response = await api.put(`/users/${id}/follow`);
    return response.data;
  },

  async unfollowUser(id: string): Promise<void> {
    const response = await api.put(`/users/${id}/unfollow`);
    return response.data;
  },

  async updateProfile(data: { username?: string; bio?: string; profilePicture?: string }): Promise<User> {
  const response = await api.put('/users/profile/update', data);
  return response.data.user;
},
};