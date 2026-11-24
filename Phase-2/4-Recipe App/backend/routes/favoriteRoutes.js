import express from "express";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from "../controllers/favoriteController.js";
import clientId from "../middlewares/clientId.js";

const router = express.Router();

router.use(clientId);

router.route("/").get(getFavorites).post(addFavorite);
router.delete("/:mealId", removeFavorite);

export default router;
