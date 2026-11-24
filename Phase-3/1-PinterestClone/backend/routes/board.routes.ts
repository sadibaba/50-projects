import { Router } from "express";
import { createBoard, listBoards, getBoard, updateBoard, deleteBoard, addPin, removePin } from "../controllers/board.controller";
import { authMiddleware, optionalAuth } from "../middleware/auth.middleware";

const router = Router();
router.get("/", optionalAuth, listBoards);
router.get("/:id", optionalAuth, getBoard);
router.post("/", authMiddleware, createBoard);
router.put("/:id", authMiddleware, updateBoard);
router.delete("/:id", authMiddleware, deleteBoard);
router.post("/:id/pins", authMiddleware, addPin);
router.delete("/:id/pins/:pinId", authMiddleware, removePin);
export default router;
