import axios from "axios";
import {
  getWatchlistFrontend,
  addToWatchlistFrontend,
  removeFromWatchlistFrontend,
  isInWatchlistFrontend,
  getReviewsFrontend,
  addReviewFrontend,
} from "./storage";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const CLIENT_KEY = "movie_app_client_id";

const getClientId = () => {
  let id = localStorage.getItem(CLIENT_KEY);
  if (!id) {
    id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `client-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    localStorage.setItem(CLIENT_KEY, id);
  }
  return id;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  config.headers["x-client-id"] = getClientId();
  return config;
});

const normalizeReview = (review) => ({
  ...review,
  id: review.id || review._id,
});

export const searchMovies = async (keyword, page = 1) => {
  try {
    const { data } = await api.get("/movies", { params: { keyword, page } });
    return data.Search || [];
  } catch (error) {
    if (error.response?.status === 404) return [];
    throw new Error(
      error.response?.data?.error || "Could not search the movie database."
    );
  }
};

export const getMovieDetails = async (imdbID) => {
  try {
    const { data } = await api.get(`/movies/${imdbID}`);
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Could not load this movie."
    );
  }
};

export const getReviews = async (movieId) => {
  try {
    const { data } = await api.get(`/reviews/${movieId}`);
    return data.map(normalizeReview);
  } catch {
    return getReviewsFrontend(movieId);
  }
};

export const addReview = async (reviewData) => {
  try {
    const { data } = await api.post("/reviews", reviewData);
    return normalizeReview(data);
  } catch {
    return addReviewFrontend(
      reviewData.movieId,
      reviewData.rating,
      reviewData.comment
    );
  }
};

export const getWatchlist = async () => {
  try {
    const { data } = await api.get("/watchlist");
    const local = getWatchlistFrontend();

    if (data.length === 0 && local.length > 0) {
      await Promise.allSettled(
        local.map((item) => api.post("/watchlist", { movieId: item.movieId }))
      );
      return local;
    }

    return data;
  } catch {
    return getWatchlistFrontend();
  }
};

export const addToWatchlist = async (movieId) => {
  try {
    const { data } = await api.post("/watchlist", { movieId });
    return data;
  } catch {
    addToWatchlistFrontend(movieId);
    return { movieId };
  }
};

export const removeFromWatchlist = async (movieId) => {
  try {
    await api.delete(`/watchlist/${movieId}`);
    return true;
  } catch {
    removeFromWatchlistFrontend(movieId);
    return true;
  }
};

export const checkInWatchlist = async (movieId) => {
  const list = await getWatchlist();
  if (list.some((item) => item.movieId === movieId)) return true;
  return isInWatchlistFrontend(movieId);
};
