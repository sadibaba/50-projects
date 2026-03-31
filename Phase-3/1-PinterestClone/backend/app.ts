import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import pinRoutes from "./routes/pin.routes";
import boardRoutes from "./routes/board.routes";
import { errorMiddleware } from "./middleware/error.middleware";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/pins", pinRoutes);
app.use("/api/boards", boardRoutes);

// Error handler (last middleware)
app.use(errorMiddleware);

export default app;
