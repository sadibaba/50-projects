import { Router } from "express";
import { getProfile, follow, unfollow, followers, following, searchUsers, savedPins } from "../controllers/user.controller";
import { authMiddleware, optionalAuth } from "../middleware/auth.middleware";

const router = Router();
router.get("/search", optionalAuth, searchUsers);
router.get("/me/saved", authMiddleware, savedPins);
router.get("/:id/followers", optionalAuth, followers);
router.get("/:id/following", optionalAuth, following);
router.get("/:id/profile", optionalAuth, getProfile);
router.get("/:id", optionalAuth, getProfile);
router.put("/:id/follow", authMiddleware, follow);
router.put("/:id/unfollow", authMiddleware, unfollow);
export default router;
