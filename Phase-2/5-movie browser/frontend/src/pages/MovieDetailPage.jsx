import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Calendar, Clock, Film, Plus, Check } from 'lucide-react';
import { getMovieDetails, addToWatchlist, getWatchlist } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import './MovieDetailPage.css';

const MovieDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inWatchlist, setInWatchlist] = useState(false);

  useEffect(() => {
    fetchMovieDetails();
    checkWatchlist();
  }, [id]);

  const fetchMovieDetails = async () => {
    setLoading(true);
    const data = await getMovieDetails(id);
    setMovie(data);
    setLoading(false);
  };

  const checkWatchlist = async () => {
    const watchlist = await getWatchlist();
    setInWatchlist(watchlist.some(item => item.movieId === id));
  };

  const handleAddToWatchlist = async () => {
    await addToWatchlist(id);
    setInWatchlist(true);
  };

  if (loading) return <LoadingSpinner />;
  if (!movie) return <div className="error-message">Movie not found</div>;

  return (
    <motion.div
      className="movie-detail-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="movie-backdrop" style={{ backgroundImage: `url(${movie.Poster !== 'N/A' ? movie.Poster : ''})` }}>
        <div className="backdrop-overlay"></div>
      </div>

      <div className="container">
        <button className="back-btn" onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
          Back to Movies
        </button>

        <div className="movie-detail-content">
          <motion.div
            className="movie-poster-large"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {movie.Poster !== 'N/A' ? (
              <img src={movie.Poster} alt={movie.Title} />
            ) : (
              <div className="no-poster-large">No Poster Available</div>
            )}
          </motion.div>

          <motion.div
            className="movie-info-large"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="movie-title-large">{movie.Title}</h1>
            <div className="movie-badges">
              <div className="badge">
                <Calendar size={16} />
                <span>{movie.Year}</span>
              </div>
              <div className="badge">
                <Clock size={16} />
                <span>{movie.Runtime}</span>
              </div>
              <div className="badge rating">
                <Star size={16} fill="#fbbf24" stroke="#fbbf24" />
                <span>{movie.imdbRating}/10</span>
              </div>
              <div className="badge">
                <Film size={16} />
                <span>{movie.Genre}</span>
              </div>
            </div>

            <div className="movie-actions">
              <button
                className={`watchlist-btn ${inWatchlist ? 'added' : ''}`}
                onClick={handleAddToWatchlist}
                disabled={inWatchlist}
              >
                {inWatchlist ? (
                  <>
                    <Check size={20} />
                    Added to Watchlist
                  </>
                ) : (
                  <>
                    <Plus size={20} />
                    Add to Watchlist
                  </>
                )}
              </button>
              <button
                className="reviews-btn"
                onClick={() => navigate(`/reviews/${id}`)}
              >
                View Reviews
              </button>
            </div>

            <div className="movie-plot">
              <h3>Plot</h3>
              <p>{movie.Plot}</p>
            </div>

            <div className="movie-details-grid">
              <div className="detail-item">
                <strong>Director:</strong>
                <span>{movie.Director}</span>
              </div>
              <div className="detail-item">
                <strong>Cast:</strong>
                <span>{movie.Actors}</span>
              </div>
              <div className="detail-item">
                <strong>Country:</strong>
                <span>{movie.Country}</span>
              </div>
              <div className="detail-item">
                <strong>Language:</strong>
                <span>{movie.Language}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default MovieDetailPage;