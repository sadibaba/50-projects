import Favorite from "../models/favorite.js";
import { ApiError, asyncHandler } from "../utils/http.js";

export const getFavorites = asyncHandler(async (req, res) => {
  const favorites = await Favorite.find({ clientId: req.clientId }).sort({
    createdAt: -1,
  });
  res.json(favorites);
});

export const addFavorite = asyncHandler(async (req, res) => {
  const { meal } = req.body;
  const mealId = meal?.idMeal || meal?.id;

  if (!meal || !mealId) {
    throw new ApiError(400, "A meal object with an id is required");
  }

  const favorite = await Favorite.findOneAndUpdate(
    { clientId: req.clientId, mealId: String(mealId) },
    { meal, mealId: String(mealId) },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  res.status(201).json(favorite);
});

export const removeFavorite = asyncHandler(async (req, res) => {
  const favorite = await Favorite.findOneAndDelete({
    clientId: req.clientId,
    mealId: String(req.params.mealId),
  });

  if (!favorite) throw new ApiError(404, "Favorite not found");
  res.json({ message: "Favorite removed" });
});
