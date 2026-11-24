import http from "http";
import dotenv from "dotenv";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import app from "./app.js";
import connectDB from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

const missing = ["MONGO_URI", "JWT_SECRET"].filter((key) => !process.env[key]);
if (missing.length) {
  console.error(`Missing required environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

const start = async () => {
  await connectDB();

  const httpServer = http.createServer(app);
  const io = new Server(httpServer, {
    cors: { origin: allowedOrigins, credentials: true },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Authentication required"));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  const roomFor = (a, b) => [a, b].sort().join("_");

  io.on("connection", (socket) => {
    socket.join(`user:${socket.userId}`);

    socket.on("joinRoom", ({ receiverId }) => {
      if (!receiverId) return;
      socket.join(roomFor(socket.userId, receiverId));
    });

    socket.on("sendMessage", (message) => {
      if (!message || String(message.sender) !== String(socket.userId)) return;
      if (!message.receiver) return;

      const room = roomFor(socket.userId, message.receiver);
      socket.to(room).emit("receiveMessage", message);
      io.to(`user:${message.receiver}`).emit("receiveMessage", message);
    });

    socket.on("disconnect", () => {});
  });

  httpServer.listen(PORT, () => {
    console.log(`Chat API listening on http://localhost:${PORT}`);
  });

  const shutdown = (signal) => {
    console.log(`${signal} received, closing server`);
    io.close();
    httpServer.close(() => process.exit(0));
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
};

start().catch((error) => {
  console.error("Failed to start server:", error.message);
  process.exit(1);
});
