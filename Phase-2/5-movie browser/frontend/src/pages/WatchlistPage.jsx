import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Film } from 'lucide-react';
import { getWatchlist, getMovieDetails, removeFromWatchlist } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import MovieCard from '../components/MovieCard';
import './WatchlistPage.css';

const WatchlistPage = () => {
  const [watchlistMovies, setWatchlistMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    setLoading(true);
    try {
      const watchlist = await getWatchlist();
      const movies = await Promise.all(
        watchlist.map(async (item) => {
          const movie = await getMovieDetails(item.movieId);
          return movie;
        })
      );
      setWatchlistMovies(movies.filter(movie => movie && movie.imdbID));
    } catch (error) {
      console.error('Error fetching watchlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (movieId) => {
    try {
      await removeFromWatchlist(movieId);
      setWatchlistMovies(watchlistMovies.filter(movie => movie.imdbID !== movieId));
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      alert('Failed to remove from watchlist');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <motion.div
      className="watchlist-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="container">
        <div className="watchlist-header">
          <h1>
            <Film size={32} color="#3b82f6" />
            My Watchlist
          </h1>
          <p className="watchlist-count">{watchlistMovies.length} Movies</p>
        </div>

        {watchlistMovies.length === 0 ? (
          <div className="empty-watchlist">
            <Film size={80} color="#1e293b" />
            <h2>Your watchlist is empty</h2>
            <p>Start adding movies to your watchlist from the movie details page!</p>
            <button className="btn-primary" onClick={() => window.location.href = '/'}>
              Browse Movies
            </button>
          </div>
        ) : (
          <div className="watchlist-grid">
            {watchlistMovies.map((movie, index) => (
              <div key={movie.imdbID} className="watchlist-item">
                <MovieCard movie={movie} index={index} />
                <button
                  className="remove-btn"
                  onClick={() => handleRemove(movie.imdbID)}
                >
                  <Trash2 size={18} />
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default WatchlistPage;