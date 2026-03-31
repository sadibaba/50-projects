import { Router } from "express";
import { getNotifications, markAsRead } from "../controllers/notification.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/", authMiddleware, getNotifications);
router.put("/:id/read", authMiddleware, markAsRead);

export default router;
