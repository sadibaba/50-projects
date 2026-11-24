import Watchlist from "../models/watchlist.js";
import { ApiError, asyncHandler } from "../utils/http.js";

export const addToWatchlist = asyncHandler(async (req, res) => {
  const { movieId } = req.body;

  if (!movieId) {
    throw new ApiError(400, "Movie ID is required");
  }

  const item = await Watchlist.findOneAndUpdate(
    { clientId: req.clientId, movieId: String(movieId) },
    { clientId: req.clientId, movieId: String(movieId) },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  res.status(201).json(item);
});

export const getWatchlist = asyncHandler(async (req, res) => {
  const list = await Watchlist.find({ clientId: req.clientId }).sort({
    createdAt: -1,
  });
  res.json(list);
});

export const removeFromWatchlist = asyncHandler(async (req, res) => {
  const result = await Watchlist.findOneAndDelete({
    clientId: req.clientId,
    movieId: String(req.params.movieId),
  });

  if (!result) {
    throw new ApiError(404, "Movie not found in watchlist");
  }

  res.json({ message: "Removed from watchlist" });
});
