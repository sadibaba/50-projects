import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SearchBar from '../components/SearchBar';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { searchMovies } from '../services/api';
import './HomePage.css';

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (query) => {
    if (!query) {
      setMovies([]);
      setSearched(false);
      return;
    }

    setLoading(true);
    setSearched(true);
    
    const results = await searchMovies(query);
    setMovies(results || []);
    setLoading(false);
  };

  return (
    <div className="homepage">
      <div className="hero-section">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="hero-title">
            Discover Your Next
            <span className="gradient-text"> Favorite Movie</span>
          </h1>
          <p className="hero-subtitle">
            Explore thousands of movies, read reviews, and create your personal watchlist
          </p>
        </motion.div>
        <SearchBar onSearch={handleSearch} loading={loading} />
      </div>

      <div className="movies-section container">
        {loading && <LoadingSpinner />}
        
        {!loading && searched && movies.length === 0 && (
          <motion.div
            className="no-results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p>No movies found. Try a different search term!</p>
          </motion.div>
        )}

        {!loading && movies.length > 0 && (
          <>
            <motion.div
              className="results-header"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h2>Found {movies.length} Movies</h2>
            </motion.div>
            <div className="movies-grid">
              {movies.map((movie, index) => (
                <MovieCard key={movie.imdbID} movie={movie} index={index} />
              ))}
            </div>
          </>
        )}

        {!searched && !loading && (
          <motion.div
            className="featured-movies"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2>Popular Searches</h2>
            <div className="suggestion-buttons">
              {['Inception', 'Avatar', 'Titanic', 'The Dark Knight', 'Interstellar'].map((suggestion) => (
                <button
                  key={suggestion}
                  className="suggestion-btn"
                  onClick={() => handleSearch(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default HomePage;