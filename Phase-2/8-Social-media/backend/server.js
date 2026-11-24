import http from "http";
import "dotenv/config";
import app from "./app.js";
import connectDB from "./db/mongo.db.js";
import { initSocket } from "./sockets/socket.js";

const PORT = process.env.PORT || 3000;
const missing = ["JWT_SECRET"].filter((key) => !process.env[key]);

if (missing.length) {
  console.error(`Missing required environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

const start = async () => {
  await connectDB();

  const server = http.createServer(app);
  initSocket(server);

  server.listen(PORT, () => {
    console.log(`Chat API listening on http://localhost:${PORT}`);
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
