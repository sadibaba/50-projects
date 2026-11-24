import { Router } from "express";
import { categories, freeImages } from "../controllers/discover.controller";

const router = Router();
router.get("/categories", categories);
router.get("/images", freeImages);
export default router;
