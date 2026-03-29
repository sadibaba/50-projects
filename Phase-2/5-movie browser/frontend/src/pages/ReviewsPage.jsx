import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, User, Calendar as CalendarIcon, Send } from 'lucide-react';
import { getReviews, addReview, getMovieDetails } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import './ReviewsPage.css';

const ReviewsPage = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [movieId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [movieData, reviewsData] = await Promise.all([
        getMovieDetails(movieId),
        getReviews(movieId)
      ]);
      setMovie(movieData);
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newReview.comment.trim()) {
      alert('Please enter a comment');
      return;
    }

    setSubmitting(true);
    try {
      const review = await addReview({
        movieId,
        rating: newReview.rating,
        comment: newReview.comment
      });
      if (review) {
        setReviews([review, ...reviews]);
        setNewReview({ rating: 5, comment: '' });
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <motion.div
      className="reviews-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="container">
        <button className="back-btn" onClick={() => navigate(`/movie/${movieId}`)}>
          <ArrowLeft size={20} />
          Back to Movie
        </button>

        <div className="reviews-header">
          <h1>
            Reviews for <span className="movie-title">{movie?.Title || 'Movie'}</span>
          </h1>
          <p className="review-count">{reviews.length} Reviews</p>
        </div>

        <div className="add-review-section">
          <h3>Write a Review</h3>
          <form onSubmit={handleSubmitReview} className="review-form">
            <div className="rating-select">
              <label>Rating:</label>
              <div className="stars">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`star-btn ${newReview.rating >= star ? 'active' : ''}`}
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                  >
                    <Star size={24} fill={newReview.rating >= star ? '#fbbf24' : 'none'} stroke="#fbbf24" />
                  </button>
                ))}
              </div>
              <span className="rating-value">{newReview.rating}/10</span>
            </div>

            <textarea
              className="review-input"
              placeholder="Share your thoughts about this movie..."
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              rows="4"
              required
            />

            <button type="submit" className="submit-review" disabled={submitting}>
              <Send size={18} />
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>

        <div className="reviews-list">
          {reviews.length === 0 ? (
            <div className="no-reviews">
              <p>No reviews yet. Be the first to review this movie!</p>
            </div>
          ) : (
            reviews.map((review, index) => (
              <motion.div
                key={review.id || index}
                className="review-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="review-header">
                  <div className="reviewer-info">
                    <User size={20} />
                    <span className="reviewer-name">Movie Lover</span>
                  </div>
                  <div className="review-rating">
                    {[...Array(10)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={i < review.rating ? '#fbbf24' : 'none'}
                        stroke="#fbbf24"
                      />
                    ))}
                    <span className="rating-number">{review.rating}/10</span>
                  </div>
                </div>
                <p className="review-comment">{review.comment}</p>
                <div className="review-date">
                  <CalendarIcon size={14} />
                  <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ReviewsPage;