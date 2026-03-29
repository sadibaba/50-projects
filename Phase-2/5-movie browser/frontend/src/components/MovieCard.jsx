import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Star, Eye } from 'lucide-react';
import './MovieCard.css';

const MovieCard = ({ movie, index }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/movie/${movie.imdbID}`);
  };

  return (
    <motion.div
      className="movie-card"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -10, scale: 1.02 }}
      onClick={handleClick}
    >
      <div className="movie-card-inner">
        <div className="movie-poster">
          {movie.Poster !== 'N/A' ? (
            <img src={movie.Poster} alt={movie.Title} loading="lazy" />
          ) : (
            <div className="no-poster">
              <span>No Poster</span>
            </div>
          )}
          <div className="movie-overlay">
            <button className="view-details-btn">
              <Eye size={20} />
              View Details
            </button>
          </div>
        </div>
        <div className="movie-info">
          <h3 className="movie-title">{movie.Title}</h3>
          <div className="movie-meta">
            <div className="movie-year">
              <span>{movie.Year}</span>
            </div>
            <div className="movie-rating">
              <Star size={16} fill="#fbbf24" stroke="#fbbf24" />
              <span>IMDb</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MovieCard;