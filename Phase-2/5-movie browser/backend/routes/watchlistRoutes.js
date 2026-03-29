import express from "express";
import { addToWatchlist, getWatchlist } from "../controllers/watchlistController.js";

const router = express.Router();

router.post("/", addToWatchlist);
router.get("/", getWatchlist);

export default router;
