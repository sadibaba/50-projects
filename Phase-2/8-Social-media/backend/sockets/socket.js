import { Server } from "socket.io";
import jwt from "jsonwebtoken";

const onlineUsers = new Map();

export const initSocket = (server) => {
  const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim());

  const io = new Server(server, {
    cors: { origin: allowedOrigins, credentials: true },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Authentication required"));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;
      next();
    } catch {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    onlineUsers.set(socket.userId, socket.id);
    io.emit("online-users", Array.from(onlineUsers.keys()));

    socket.on("private-message", async (data) => {
      try {
        const { receiverId, message } = data || {};
        if (!receiverId || !message || !String(message).trim()) return;

        const Message = (await import("../models/message_model.js")).default;
        const newMessage = await Message.create({
          sender: socket.userId,
          receiver: receiverId,
          message: String(message).trim().slice(0, 4000),
        });

        const populated = await newMessage.populate(
          "sender receiver",
          "username email"
        );

        const receiverSocketId = onlineUsers.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("new-message", populated);
        }

        socket.emit("message-sent", populated);
      } catch (error) {
        socket.emit("message-error", { error: "Message could not be sent" });
      }
    });

    socket.on("typing", (data) => {
      const { receiverId, isTyping } = data || {};
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("user-typing", {
          userId: socket.userId,
          isTyping: Boolean(isTyping),
        });
      }
    });

    socket.on("disconnect", () => {
      onlineUsers.delete(socket.userId);
      io.emit("online-users", Array.from(onlineUsers.keys()));
    });
  });

  return io;
};
