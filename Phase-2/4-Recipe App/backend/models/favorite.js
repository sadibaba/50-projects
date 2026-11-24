import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    clientId: { type: String, required: true, index: true },
    mealId: { type: String, required: true },
    meal: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

favoriteSchema.index({ clientId: 1, mealId: 1 }, { unique: true });

export default mongoose.model("Favorite", favoriteSchema);
