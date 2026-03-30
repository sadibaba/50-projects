import express from "express";
import { createTag, getTags, deleteTag } from "../controllers/tagController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/")
  .post(protect, createTag)
  .get(protect, getTags);

router.route("/:id")
  .delete(protect, deleteTag);

export default router;
