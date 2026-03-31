import { Router } from "express";
import { createPin, getPins, deletePin } from "../controllers/pin.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authMiddleware, createPin);
router.get("/", getPins);
router.delete("/:id", authMiddleware, deletePin);

export default router;
