import axios from 'axios';
import { 
  getWatchlistFrontend, 
  addToWatchlistFrontend, 
  removeFromWatchlistFrontend,
  isInWatchlistFrontend,
  getReviewsFrontend,
  addReviewFrontend
} from './storage';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Movie endpoints (using backend for OMDB API)
export const searchMovies = async (keyword) => {
  try {
    const response = await api.get(`/movies?keyword=${keyword}`);
    return response.data.Search || [];
  } catch (error) {
    console.error('Error searching movies:', error);
    return [];
  }
};

// Get movie details through your backend (same as search)
export const getMovieDetails = async (imdbID) => {
  try {
    // Use your backend as a proxy to OMDB API
    const response = await api.get(`/movies/${imdbID}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};

// Review endpoints (using localStorage)
export const getReviews = async (movieId) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 100));
    return getReviewsFrontend(movieId);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
};

export const addReview = async (reviewData) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 100));
    const newReview = addReviewFrontend(reviewData.movieId, reviewData.rating, reviewData.comment);
    return newReview;
  } catch (error) {
    console.error('Error adding review:', error);
    return null;
  }
};

// Watchlist endpoints (using localStorage)
export const getWatchlist = async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 100));
    return getWatchlistFrontend();
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    return [];
  }
};

export const addToWatchlist = async (movieId) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 100));
    addToWatchlistFrontend(movieId);
    return { success: true };
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    return null;
  }
};

export const removeFromWatchlist = async (movieId) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 100));
    removeFromWatchlistFrontend(movieId);
    return true;
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    return false;
  }
};

export const checkInWatchlist = async (movieId) => {
  return isInWatchlistFrontend(movieId);
};