import express from "express";
import cors from "cors";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Example route
app.get("/api/health", (_req, res) => {
  res.json({ status: "Backend running with TS 🚀" });
});

export default app;
