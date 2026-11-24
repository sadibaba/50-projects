import { Router } from "express";
import { list, markRead, markAllRead } from "../controllers/notification.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();
router.get("/", authMiddleware, list);
router.put("/read-all", authMiddleware, markAllRead);
router.put("/:id/read", authMiddleware, markRead);
export default router;
