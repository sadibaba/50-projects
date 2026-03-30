import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

// Routes
import userRoutes from "./routes/userRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import tagRoutes from "./routes/tagRoutes.js";

dotenv.config();

// Connect Database
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Notes API is running...");
});

// API routes
app.use("/api/users", userRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/tags", tagRoutes);

// Error middleware
app.use(notFound);
app.use(errorHandler);

export default app;
