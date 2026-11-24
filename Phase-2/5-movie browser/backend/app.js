import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import movieRoutes from "./routes/movieRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import watchlistRoutes from "./routes/watchlistRoutes.js";

import { logger } from "./middlewares/loggingMiddleware.js";
import {
  errorHandler,
  notFound,
} from "./middlewares/errorHandlingMiddleware.js";

dotenv.config();
const app = express();

const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Origin is not allowed by CORS"));
    },
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(logger);

app.get("/", (req, res) => {
  res.json({ name: "Movie Browser API", version: "1.0.0", status: "running" });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    omdbConfigured: Boolean(process.env.OMDB_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/movies", movieRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/watchlist", watchlistRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
