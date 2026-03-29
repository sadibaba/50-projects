import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import limiter from "./middlewares/rateLimiter.js";
import errorHandler from "./middlewares/errorHandler.js";
import mealRoutes from "./routes/mealRoutes.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(limiter);

// Routes
app.use("/api/meals", mealRoutes);

// Error Handler
app.use(errorHandler);

export default app;
