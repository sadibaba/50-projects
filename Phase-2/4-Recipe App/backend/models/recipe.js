import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
  title: String,
  description: String,
  ingredients: [String],
  instructions: String,
  image_url: String,
  tags: [String],
});

export default mongoose.model("Recipe", recipeSchema);
