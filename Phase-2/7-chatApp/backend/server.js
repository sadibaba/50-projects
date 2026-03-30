import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();
connectDB();

const PORT = process.env.PORT || 5000;

// HTTP server wrap
const httpServer = createServer(app);

// Socket.IO server
const io = new Server(httpServer, {
  cors: {
    origin: "*", // React frontend ka URL dalna better hai
    methods: ["GET", "POST"]
  }
});

// Socket.IO events
io.on("connection", (socket) => {
  console.log("⚡ New client connected:", socket.id);

  // join room (conversation)
  socket.on("joinRoom", ({ senderId, receiverId }) => {
    const roomId = [senderId, receiverId].sort().join("_");
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  // send message
  socket.on("sendMessage", (messageData) => {
    const roomId = [messageData.sender, messageData.receiver].sort().join("_");
    io.to(roomId).emit("receiveMessage", messageData);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
