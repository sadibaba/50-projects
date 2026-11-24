import http from "http";
import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./database/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

if (!process.env.MONGO_URI) {
  console.error("MONGO_URI is not defined. Copy .env.example to .env.");
  process.exit(1);
}

const start = async () => {
  await connectDB();

  const server = http.createServer(app);
  server.listen(PORT, () => {
    console.log(`Recipe API listening on http://localhost:${PORT}`);
  });

  const shutdown = (signal) => {
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
