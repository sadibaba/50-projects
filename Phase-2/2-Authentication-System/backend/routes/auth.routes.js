import express from "express";
import {
  signup,
  login,
  logout,
  getProfile,
  getAllUsers,
  deleteUser,
} from "../controller/auth.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.get("/me", authMiddleware, getProfile);

/* Admin routes */
router.get("/admin/users", authMiddleware, adminMiddleware, getAllUsers);
router.delete(
  "/admin/users/:id",
  authMiddleware,
  adminMiddleware,
  deleteUser
);

export default router;
