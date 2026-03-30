import express from "express";
import { getUsers, searchUsers } from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getUsers);
router.get("/search", authMiddleware, searchUsers);

export default router;