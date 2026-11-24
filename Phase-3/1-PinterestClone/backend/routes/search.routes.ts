import { Router } from "express";
import { search } from "../controllers/search.controller";
import { optionalAuth } from "../middleware/auth.middleware";

const router = Router();
router.get("/", optionalAuth, search);
export default router;
