import api from './api';

export const unsplashService = {
  async searchImages(query: string, page: number = 1, perPage: number = 20) {
    const response = await api.get('/unsplash/images', {
      params: { query, page, perPage }
    });
    return response.data;
  },

  async getRandomImages(count: number = 20) {
    const response = await api.get('/unsplash/images/random', {
      params: { count }
    });
    return response.data;
  },
};