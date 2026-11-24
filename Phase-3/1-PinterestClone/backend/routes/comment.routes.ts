import { Router } from "express";
import { addComment, getComments, deleteComment } from "../controllers/comment.controller";
import { authMiddleware, optionalAuth } from "../middleware/auth.middleware";

const router = Router();
router.get("/pins/:id/comments", optionalAuth, getComments);
router.post("/pins/:id/comments", authMiddleware, addComment);
router.delete("/comments/:id", authMiddleware, deleteComment);
export default router;
