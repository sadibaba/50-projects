import express from "express";
import { addToWatchlist, getWatchlist, removeFromWatchlist } from "../controllers/watchlistController.js";

const router = express.Router();

router.post("/", addToWatchlist);
router.get("/", getWatchlist);
router.delete("/:movieId", removeFromWatchlist);

export default router;