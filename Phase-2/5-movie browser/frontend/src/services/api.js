import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Movie endpoints
export const searchMovies = async (keyword) => {
  try {
    const response = await api.get(`/movies?keyword=${keyword}`);
    return response.data.Search || [];
  } catch (error) {
    console.error('Error searching movies:', error);
    return [];
  }
};

export const getMovieDetails = async (imdbID) => {
  try {
    const response = await axios.get('http://www.omdbapi.com/', {
      params: {
        apikey: process.env.REACT_APP_OMDB_API_KEY,
        i: imdbID,
        plot: 'full'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
};

// Review endpoints
export const getReviews = async (movieId) => {
  try {
    const response = await api.get(`/reviews/${movieId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
};

export const addReview = async (reviewData) => {
  try {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  } catch (error) {
    console.error('Error adding review:', error);
    return null;
  }
};

// Watchlist endpoints
export const getWatchlist = async () => {
  try {
    const response = await api.get('/watchlist');
    return response.data;
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    return [];
  }
};

export const addToWatchlist = async (movieId) => {
  try {
    const response = await api.post('/watchlist', { movieId });
    return response.data;
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    return null;
  }
};

export const removeFromWatchlist = async (movieId) => {
  try {
    await api.delete(`/watchlist/${movieId}`);
    return true;
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    return false;
  }
};