import { Router } from "express";
import { addComment, getComments, deleteComment } from "../controllers/comment.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// Add comment to a pin
router.post("/pins/:id/comments", authMiddleware, addComment);

// Get comments for a pin
router.get("/pins/:id/comments", authMiddleware, getComments);

// Delete a comment
router.delete("/comments/:id", authMiddleware, deleteComment);

export default router;
