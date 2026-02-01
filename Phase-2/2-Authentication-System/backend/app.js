// app.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Test route
app.get("/", (req, res) => {
  res.send("Server is running...");
});

export default app;