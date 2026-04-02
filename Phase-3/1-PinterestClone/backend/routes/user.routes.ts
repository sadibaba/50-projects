import { Router } from "express";
import { followUser, unfollowUser ,getUserProfile ,updateProfile , getCurrentUser } from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.put("/:id/follow", authMiddleware, followUser);
router.put("/:id/unfollow", authMiddleware, unfollowUser);
router.get("/:id/profile", authMiddleware, getUserProfile);
router.put("/profile/update", authMiddleware, updateProfile);
router.get("/me", authMiddleware, getCurrentUser);

export default router;
