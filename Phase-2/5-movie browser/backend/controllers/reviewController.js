import Review from "../models/review.js";

export async function addReview(req, res) {
  try {
    const { movieId, rating, comment } = req.body;
    
    // Validate required fields
    if (!movieId || !rating || !comment) {
      return res.status(400).json({ error: "Movie ID, rating, and comment are required" });
    }
    
    const review = new Review({ 
      movieId, 
      rating, 
      comment,
      userId: null  
    });
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    console.error('Error adding review:', err);
    res.status(500).json({ error: "Failed to add review: " + err.message });
  }
}

export async function getReviews(req, res) {
  try {
    const { movieId } = req.params;
    const reviews = await Review.find({ movieId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    console.error('Error fetching reviews:', err);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
}