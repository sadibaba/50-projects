import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Calendar, Clock, Film, Plus, Check } from 'lucide-react';
import { getMovieDetails, addToWatchlist, checkInWatchlist } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import './MovieDetailPage.css';

const MovieDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMovieDetails();
    checkWatchlistStatus();
  }, [id]);

  const fetchMovieDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching movie details for ID:', id); // Debug log
      const data = await getMovieDetails(id);
      console.log('Received data:', data); // Debug log
      
      if (data && data.error) {
        setError(data.error);
        setMovie(null);
      } else if (data && data.imdbID) {
        setMovie(data);
      } else {
        setError('Movie not found');
      }
    } catch (err) {
      console.error('Error in fetchMovieDetails:', err);
      setError(err.response?.data?.error || 'Failed to load movie details');
    } finally {
      setLoading(false);
    }
  };

  const checkWatchlistStatus = async () => {
    try {
      const inList = await checkInWatchlist(id);
      setInWatchlist(inList);
    } catch (err) {
      console.error('Error checking watchlist:', err);
    }
  };

  const handleAddToWatchlist = async () => {
    try {
      await addToWatchlist(id);
      setInWatchlist(true);
    } catch (err) {
      console.error('Error adding to watchlist:', err);
      alert('Failed to add to watchlist');
    }
  };

  if (loading) return <LoadingSpinner />;
  
  if (error || !movie) {
    return (
      <div className="movie-detail-page">
        <div className="container">
          <button className="back-btn" onClick={() => navigate('/')}>
            <ArrowLeft size={20} />
            Back to Movies
          </button>
          <div className="error-message">
            <h2>Error Loading Movie</h2>
            <p>{error || 'Movie not found'}</p>
            <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
              Movie ID: {id}
            </p>
            <button 
              className="btn-primary" 
              onClick={() => navigate('/')} 
              style={{ marginTop: '1rem' }}
            >
              Go Back Home
            </button>
          </div>
        </div>
      </div>
    );
  }

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
            {movie.Poster && movie.Poster !== 'N/A' ? (
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
                <span>{movie.Year || 'N/A'}</span>
              </div>
              <div className="badge">
                <Clock size={16} />
                <span>{movie.Runtime || 'N/A'}</span>
              </div>
              <div className="badge rating">
                <Star size={16} fill="#fbbf24" stroke="#fbbf24" />
                <span>{movie.imdbRating !== 'N/A' ? `${movie.imdbRating}/10` : 'N/A'}</span>
              </div>
              <div className="badge">
                <Film size={16} />
                <span>{movie.Genre || 'N/A'}</span>
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
              <p>{movie.Plot !== 'N/A' ? movie.Plot : 'No plot available.'}</p>
            </div>

            <div className="movie-details-grid">
              <div className="detail-item">
                <strong>Director:</strong>
                <span>{movie.Director !== 'N/A' ? movie.Director : 'N/A'}</span>
              </div>
              <div className="detail-item">
                <strong>Cast:</strong>
                <span>{movie.Actors !== 'N/A' ? movie.Actors : 'N/A'}</span>
              </div>
              <div className="detail-item">
                <strong>Country:</strong>
                <span>{movie.Country !== 'N/A' ? movie.Country : 'N/A'}</span>
              </div>
              <div className="detail-item">
                <strong>Language:</strong>
                <span>{movie.Language !== 'N/A' ? movie.Language : 'N/A'}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default MovieDetailPage;