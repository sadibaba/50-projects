import { Router } from "express";
import { createPin, getPins,getPinById, deletePin } from "../controllers/pin.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authMiddleware, createPin);
router.get("/", getPins);
router.get("/:id", getPinById);
router.delete("/:id", authMiddleware, deletePin);

export default router;
