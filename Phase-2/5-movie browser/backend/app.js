import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import movieRoutes from "./routes/movieRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import watchlistRoutes from "./routes/watchlistRoutes.js";

import { logger } from "./middlewares/loggingMiddleware.js";
import { errorHandler } from "./middlewares/errorHandlingMiddleware.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

// Routes
app.use("/api/movies", movieRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/watchlist", watchlistRoutes);

// Error handler
app.use(errorHandler);

export default app;
