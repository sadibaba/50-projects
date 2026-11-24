import express from "express";
import cors from "cors";
import path from "path";
import authRoutes from "./routes/auth.routes";
import pinRoutes from "./routes/pin.routes";
import boardRoutes from "./routes/board.routes";
import userRoutes from "./routes/user.routes";
import commentRoutes from "./routes/comment.routes";
import notificationRoutes from "./routes/notification.routes";
import searchRoutes from "./routes/search.routes";
import discoverRoutes from "./routes/discover.routes";
import uploadRoutes from "./routes/upload.routes";
import { errorMiddleware, notFound } from "./middleware/error.middleware";

const app = express();

const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:3000,http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error("Origin not allowed by CORS"));
  },
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads"), { maxAge: "7d" }));

app.get("/", (_req, res) => res.json({ name: "Pinterest Clone API", version: "1.0.0", status: "running" }));
app.get("/api/health", (_req, res) => res.json({ status: "ok", timestamp: new Date().toISOString() }));

app.use("/api/auth", authRoutes);
app.use("/api/pins", pinRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/users", userRoutes);
app.use("/api", commentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/discover", discoverRoutes);
app.use("/api/upload", uploadRoutes);

app.use(notFound);
app.use(errorMiddleware);

export default app;
