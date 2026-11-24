import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    description: { type: String, default: "", maxlength: 1000 },
    ingredients: [String],
    instructions: { type: String, default: "" },
    image_url: { type: String, default: "" },
    tags: [String],
  },
  { timestamps: true }
);

recipeSchema.index({ title: "text" });

export default mongoose.model("Recipe", recipeSchema);
