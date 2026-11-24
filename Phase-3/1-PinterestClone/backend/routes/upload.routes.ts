import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { authMiddleware } from "../middleware/auth.middleware";

const directory = path.join(process.cwd(), "uploads");
if (!fs.existsSync(directory)) fs.mkdirSync(directory, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, directory),
  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase() || ".jpg";
    cb(null, `${crypto.randomBytes(12).toString("hex")}${extension}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) return cb(new Error("Only image files are allowed"));
    cb(null, true);
  },
});

const router = Router();
router.post("/", authMiddleware, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No image uploaded" });
  const base = process.env.PUBLIC_API_URL || `${req.protocol}://${req.get("host")}`;
  res.status(201).json({
    url: `${base}/uploads/${req.file.filename}`,
    filename: req.file.filename,
    size: req.file.size,
  });
});

export default router;
