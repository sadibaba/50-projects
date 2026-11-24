import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import app from "./app.js";

const PORT = process.env.PORT || 5000;
const missing = ["MONGO_URI", "JWT_SECRET"].filter((key) => !process.env[key]);

if (missing.length) {
  console.error(`Missing required environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error.name, error.message);
  process.exit(1);
});

const start = async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
  });
  console.log(`MongoDB connected: ${mongoose.connection.host}`);

  const server = app.listen(PORT, () => {
    console.log(`Blog API listening on http://localhost:${PORT}`);
  });

  process.on("unhandledRejection", (error) => {
    console.error("Unhandled rejection:", error?.name, error?.message);
    server.close(() => process.exit(1));
  });

  const shutdown = (signal) => {
    console.log(`${signal} received, closing server`);
    server.close(() => process.exit(0));
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
};

start().catch((error) => {
  console.error("MongoDB connection failed:", error.message);
  process.exit(1);
});
