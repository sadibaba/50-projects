import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    clientId: { type: String, required: true, index: true },
    movieId: { type: String, required: true, index: true },
    rating: { type: Number, min: 1, max: 10, required: true },
    comment: { type: String, required: true, trim: true, maxlength: 2000 },
  },
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);
