import { Router } from "express";
import { createPin, getPins,getPinById, deletePin ,likePin, unlikePin, savePin, unsavePin } from "../controllers/pin.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authMiddleware, createPin);
router.get("/", getPins);
router.get("/:id", getPinById);
router.delete("/:id", authMiddleware, deletePin);

router.put("/:id/like", authMiddleware, likePin);
router.put("/:id/unlike", authMiddleware, unlikePin);

router.put("/:id/save", authMiddleware, savePin);
router.put("/:id/unsave", authMiddleware, unsavePin);


export default router;
