import api from './api';
import { Pin, CreatePinData } from '@/types';

export const pinService = {
  async getAllPins(): Promise<Pin[]> {
    const response = await api.get('/pins');
    return response.data;
  },

  async getPinById(id: string): Promise<Pin> {
    const response = await api.get(`/pins/${id}`);
    return response.data;
  },

  async createPin(data: CreatePinData): Promise<Pin> {
    const response = await api.post('/pins', data);
    return response.data;
  },

  async deletePin(id: string): Promise<void> {
    await api.delete(`/pins/${id}`);
  },

  async likePin(id: string): Promise<void> {
    const response = await api.put(`/pins/${id}/like`);
    return response.data;
  },

  async unlikePin(id: string): Promise<void> {
    const response = await api.put(`/pins/${id}/unlike`);
    return response.data;
  },

  async savePin(id: string): Promise<void> {
    const response = await api.put(`/pins/${id}/save`);
    return response.data;
  },

  async unsavePin(id: string): Promise<void> {
    const response = await api.put(`/pins/${id}/unsave`);
    return response.data;
  },

  async getFeed(): Promise<Pin[]> {
    const response = await api.get('/feed');
    return response.data;
  },

  async search(query: string): Promise<{ pins: Pin[]; boards: any[] }> {
    const response = await api.get(`/search?query=${encodeURIComponent(query)}`);
    return response.data;
  },
};