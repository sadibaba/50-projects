import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import limiter from "./middlewares/rateLimiter.js";
import errorHandler, { notFound } from "./middlewares/errorHandler.js";
import mealRoutes from "./routes/mealRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";

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
app.use(limiter);

app.get("/", (req, res) => {
  res.json({ name: "Recipe App API", version: "1.0.0", status: "running" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/meals", mealRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/favorites", favoriteRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
