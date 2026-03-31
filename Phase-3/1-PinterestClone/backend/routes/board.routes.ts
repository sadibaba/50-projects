import { Router } from "express";
import { createBoard, getBoards, addPinToBoard } from "../controllers/board.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authMiddleware, createBoard);
router.get("/", getBoards);
router.post("/add-pin", authMiddleware, addPinToBoard);

export default router;
