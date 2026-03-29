import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  releaseDate: Date,
  genre: [String],
  posterUrl: String,
  rating: { type: Number, default: 0 }, 
}, { timestamps: true });

export default mongoose.model("Movie", movieSchema);
