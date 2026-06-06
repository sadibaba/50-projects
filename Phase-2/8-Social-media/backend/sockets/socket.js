import { Server } from "socket.io";
import jwt from "jsonwebtoken";

const onlineUsers = new Map();

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error("Authentication error"));
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
      socket.userId = decoded.userId;
      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.userId);
    
    onlineUsers.set(socket.userId, socket.id);
    io.emit("online-users", Array.from(onlineUsers.keys()));
    
    // Private message
    socket.on("private-message", async (data) => {
      const { receiverId, message } = data;
      const senderId = socket.userId;
      
      const Message = (await import("../models/message_model.js")).default;
      const newMessage = new Message({
        sender: senderId,
        receiver: receiverId,
        message: message,
      });
      await newMessage.save();
      
      const populatedMessage = await newMessage.populate("sender receiver", "username email");
      
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("new-message", populatedMessage);
      }
      
      socket.emit("message-sent", populatedMessage);
    });
    
    // Typing indicator
    socket.on("typing", (data) => {
      const { receiverId, isTyping } = data;
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("user-typing", {
          userId: socket.userId,
          isTyping,
        });
      }
    });
    
    // Disconnect
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.userId);
      onlineUsers.delete(socket.userId);
      io.emit("online-users", Array.from(onlineUsers.keys()));
    });
  });

  return io;
};