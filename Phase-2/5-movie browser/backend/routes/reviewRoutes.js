import express from "express";
import {
  addReview,
  getReviews,
  deleteReview,
} from "../controllers/reviewController.js";
import clientId from "../middlewares/clientId.js";

const router = express.Router();

router.use(clientId);

router.route("/").post(addReview);
router.get("/:movieId", getReviews);
router.delete("/:id", deleteReview);

export default router;
