import express from "express";
import { sendMessage, getMessages } from "../controllers/messageController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, sendMessage);
router.get("/", authMiddleware, getMessages);

export default router;
