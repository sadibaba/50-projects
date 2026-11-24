import { Router } from "express";
import { listPins, getPin, createPin, updatePin, deletePin, likePin, unlikePin, savePin, unsavePin } from "../controllers/pin.controller";
import { authMiddleware, optionalAuth } from "../middleware/auth.middleware";

const router = Router();
router.get("/", optionalAuth, listPins);
router.get("/:id", optionalAuth, getPin);
router.post("/", authMiddleware, createPin);
router.put("/:id", authMiddleware, updatePin);
router.delete("/:id", authMiddleware, deletePin);
router.put("/:id/like", authMiddleware, likePin);
router.put("/:id/unlike", authMiddleware, unlikePin);
router.put("/:id/save", authMiddleware, savePin);
router.put("/:id/unsave", authMiddleware, unsavePin);
export default router;
