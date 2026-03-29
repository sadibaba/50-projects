import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    default: null  
  },
  movieId: { type: String, required: true },  
  rating: { type: Number, min: 1, max: 10, required: true },
  comment: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("Review", reviewSchema);