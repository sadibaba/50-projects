import dotenv from "dotenv";
dotenv.config();

import http from "http";
import app from "./app";
import connectDB from "./utils/db";
import { seedDatabase } from "./utils/seed";

const PORT = process.env.PORT || 5000;
const missing = ["MONGO_URI", "JWT_SECRET"].filter((key) => !process.env[key]);
if (missing.length) {
  console.error(`Missing required environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

const start = async () => {
  await connectDB();
  await seedDatabase();

  const server = http.createServer(app);
  server.listen(PORT, () => console.log(`Pinterest API listening on http://localhost:${PORT}`));

  const shutdown = (signal: string) => {
    console.log(`${signal} received, closing server`);
    server.close(() => process.exit(0));
  };
  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
};

start().catch((error) => {
  console.error("Failed to start server:", error.message);
  process.exit(1);
});
