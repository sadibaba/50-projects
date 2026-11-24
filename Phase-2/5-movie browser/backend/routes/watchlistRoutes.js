import express from "express";
import {
  addToWatchlist,
  getWatchlist,
  removeFromWatchlist,
} from "../controllers/watchlistController.js";
import clientId from "../middlewares/clientId.js";

const router = express.Router();

router.use(clientId);

router.route("/").get(getWatchlist).post(addToWatchlist);
router.delete("/:movieId", removeFromWatchlist);

export default router;
