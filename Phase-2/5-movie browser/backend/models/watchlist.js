import mongoose from "mongoose";

const watchlistSchema = new mongoose.Schema(
  {
    clientId: { type: String, required: true, index: true },
    movieId: { type: String, required: true },
  },
  { timestamps: true }
);

watchlistSchema.index({ clientId: 1, movieId: 1 }, { unique: true });

export default mongoose.model("Watchlist", watchlistSchema);
