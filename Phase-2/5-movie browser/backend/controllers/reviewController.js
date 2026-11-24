import Review from "../models/review.js";
import { ApiError, asyncHandler } from "../utils/http.js";

export const addReview = asyncHandler(async (req, res) => {
  const { movieId, rating, comment } = req.body;
  const numericRating = Number(rating);

  if (!movieId || !comment || !String(comment).trim()) {
    throw new ApiError(400, "Movie ID, rating and comment are required");
  }

  if (!Number.isFinite(numericRating) || numericRating < 1 || numericRating > 10) {
    throw new ApiError(400, "Rating must be between 1 and 10");
  }

  const review = await Review.create({
    clientId: req.clientId,
    movieId: String(movieId),
    rating: numericRating,
    comment: String(comment).trim(),
  });

  res.status(201).json(review);
});

export const getReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ movieId: String(req.params.movieId) }).sort({
    createdAt: -1,
  });
  res.json(reviews);
});

export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findOneAndDelete({
    _id: req.params.id,
    clientId: req.clientId,
  });

  if (!review) throw new ApiError(404, "Review not found");
  res.json({ message: "Review deleted" });
});
