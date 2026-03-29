const STORAGE_KEYS = {
  WATCHLIST: 'movie_app_watchlist',
  REVIEWS: 'movie_app_reviews'
};

// Watchlist functions
export const getWatchlistFrontend = () => {
  const watchlist = localStorage.getItem(STORAGE_KEYS.WATCHLIST);
  return watchlist ? JSON.parse(watchlist) : [];
};

export const addToWatchlistFrontend = (movieId) => {
  const watchlist = getWatchlistFrontend();
  if (!watchlist.some(item => item.movieId === movieId)) {
    watchlist.push({ movieId, addedAt: new Date().toISOString() });
    localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify(watchlist));
  }
  return getWatchlistFrontend();
};

export const removeFromWatchlistFrontend = (movieId) => {
  const watchlist = getWatchlistFrontend();
  const filtered = watchlist.filter(item => item.movieId !== movieId);
  localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify(filtered));
  return getWatchlistFrontend();
};

export const isInWatchlistFrontend = (movieId) => {
  const watchlist = getWatchlistFrontend();
  return watchlist.some(item => item.movieId === movieId);
};

// Review functions
export const getReviewsFrontend = (movieId) => {
  const allReviews = localStorage.getItem(STORAGE_KEYS.REVIEWS);
  const reviews = allReviews ? JSON.parse(allReviews) : [];
  return reviews.filter(review => review.movieId === movieId);
};

export const addReviewFrontend = (movieId, rating, comment) => {
  const allReviews = localStorage.getItem(STORAGE_KEYS.REVIEWS);
  const reviews = allReviews ? JSON.parse(allReviews) : [];
  
  const newReview = {
    id: Date.now(),
    movieId,
    rating,
    comment,
    createdAt: new Date().toISOString(),
    userId: 'user_1'
  };
  
  reviews.push(newReview);
  localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  return newReview;
};

// Clear all data (for testing)
export const clearAllData = () => {
  localStorage.removeItem(STORAGE_KEYS.WATCHLIST);
  localStorage.removeItem(STORAGE_KEYS.REVIEWS);
};