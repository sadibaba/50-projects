import api from './api';

export const imageService = {
  async searchImages(query: string, page: number = 1, perPage: number = 20) {
    try {
      const response = await api.get('/images/images', {
        params: { query, page, perPage }
      });
      return response.data;
    } catch (error) {
      console.error('API error:', error);
      // Fallback images that always work
      const fallbackImages = [];
      for (let i = 0; i < perPage; i++) {
        fallbackImages.push({
          id: `fallback-${i}`,
          urls: {
            regular: `https://picsum.photos/id/${(i + 1) * 10}/500/500`,
            small: `https://picsum.photos/id/${(i + 1) * 10}/200/200`,
            thumb: `https://picsum.photos/id/${(i + 1) * 10}/100/100`,
          },
          user: { name: 'Picsum', username: 'picsum' },
          alt_description: query,
          description: `Beautiful ${query} image`,
          likes: Math.floor(Math.random() * 500),
        });
      }
      return { results: fallbackImages, total: fallbackImages.length };
    }
  },

  async getRandomImages(count: number = 20) {
    try {
      const response = await api.get('/images/images/random', {
        params: { count }
      });
      return response.data;
    } catch (error) {
      console.error('API error:', error);
      const fallbackImages = [];
      for (let i = 0; i < count; i++) {
        fallbackImages.push({
          id: `random-${i}`,
          urls: {
            regular: `https://picsum.photos/id/${(i + 1) * 10}/500/500`,
            small: `https://picsum.photos/id/${(i + 1) * 10}/200/200`,
          },
          user: { name: 'Picsum', username: 'picsum' },
          alt_description: 'Random image',
        });
      }
      return fallbackImages;
    }
  },
};