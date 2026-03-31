import { Router } from "express";
import { getFeed } from "../controllers/feed.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/", authMiddleware, getFeed);

export default router;
