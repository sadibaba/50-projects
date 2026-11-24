import express from "express";
import {
  getRecipes,
  getRecipeById,
  createRecipe,
} from "../controllers/recipeController.js";

const router = express.Router();

router.route("/").get(getRecipes).post(createRecipe);
router.get("/:id", getRecipeById);

export default router;
