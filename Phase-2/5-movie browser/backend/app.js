import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Routes
// import movieRoutes from "./routes/movieRoutes.js";
// import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
// app.use("/api/movies", movieRoutes);
// app.use("/api/auth", authRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Movie Browser API is running...");
});

export default app;
