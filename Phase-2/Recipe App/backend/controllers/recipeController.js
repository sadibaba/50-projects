import Recipe from "../models/Recipe.js";

// @desc Get all recipes or search
// @route GET /api/recipes
export const getRecipes = async (req, res) => {
  try {
    const { search } = req.query;
    const query = search
      ? { title: { $regex: search, $options: "i" } }
      : {};

    const recipes = await Recipe.find(query);
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching recipes" });
  }
};

// @desc Get single recipe by ID
// @route GET /api/recipes/:id
export const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: "Error fetching recipe" });
  }
};
