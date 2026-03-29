import Review from "../models/review.js";

export async function addReview(req, res) {
  try {
    const { movieId, rating, comment } = req.body;
    const review = new Review({ movieId, rating, comment });
    await review.save();
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: "Failed to add review" });
  }
}

export async function getReviews(req, res) {
  try {
    const { movieId } = req.params;
    const reviews = await Review.find({ movieId });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
}
