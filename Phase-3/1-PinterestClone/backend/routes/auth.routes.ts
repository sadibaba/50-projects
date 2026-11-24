import { Router } from "express";
import { register, login, me, updateMe, changePassword } from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();
router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, me);
router.put("/me", authMiddleware, updateMe);
router.put("/me/password", authMiddleware, changePassword);
export default router;
