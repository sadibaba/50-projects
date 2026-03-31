import { Router } from "express";
import { search } from "../controllers/search.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/", authMiddleware, search);

export default router;
