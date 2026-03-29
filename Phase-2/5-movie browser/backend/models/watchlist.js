import mongoose from "mongoose";

const watchlistSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    default: null 
  },
  movieId: { type: String, required: true },  
}, { timestamps: true });

// Add compound index to prevent duplicates
watchlistSchema.index({ userId: 1, movieId: 1 }, { unique: true });

export default mongoose.model("Watchlist", watchlistSchema);