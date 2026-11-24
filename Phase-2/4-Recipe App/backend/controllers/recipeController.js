import Recipe from "../models/recipe.js";
import { ApiError, asyncHandler } from "../utils/http.js";

export const getRecipes = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const query = search
    ? { title: { $regex: String(search), $options: "i" } }
    : {};

  const recipes = await Recipe.find(query).sort({ createdAt: -1 }).limit(100);
  res.json(recipes);
});

export const getRecipeById = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) throw new ApiError(404, "Recipe not found");
  res.json(recipe);
});

export const createRecipe = asyncHandler(async (req, res) => {
  const { title, description, ingredients, instructions, image_url, tags } =
    req.body;

  if (!title || !String(title).trim()) {
    throw new ApiError(400, "Recipe title is required");
  }

  const recipe = await Recipe.create({
    title: String(title).trim(),
    description: description || "",
    ingredients: Array.isArray(ingredients) ? ingredients : [],
    instructions: instructions || "",
    image_url: image_url || "",
    tags: Array.isArray(tags) ? tags : [],
  });

  res.status(201).json(recipe);
});
