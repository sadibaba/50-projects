import mongoose from "mongoose";
import Message from "../models/message_model.js";
import User from "../models/user_model.js";
import { ApiError, asyncHandler } from "../utils/http.js";

export const getMessages = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const currentUserId = req.user.userId;

  if (!mongoose.isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user id");
  }

  const messages = await Message.find({
    $or: [
      { sender: currentUserId, receiver: userId },
      { sender: userId, receiver: currentUserId },
    ],
  })
    .populate("sender receiver", "username email")
    .sort({ createdAt: 1 });

  res.json(messages);
});

export const getChatUsers = asyncHandler(async (req, res) => {
  const currentUserId = req.user.userId;
  const messages = await Message.find({
    $or: [{ sender: currentUserId }, { receiver: currentUserId }],
  })
    .populate("sender receiver", "username email")
    .sort({ createdAt: -1 });

  const chatUsers = new Map();

  for (const message of messages) {
    if (!message.sender || !message.receiver) continue;

    const otherUser =
      message.sender._id.toString() === currentUserId
        ? message.receiver
        : message.sender;

    const key = otherUser._id.toString();
    if (!chatUsers.has(key)) {
      chatUsers.set(key, {
        _id: otherUser._id,
        username: otherUser.username,
        email: otherUser.email,
        lastMessage: message.message,
        lastMessageTime: message.createdAt,
      });
    }
  }

  res.json(Array.from(chatUsers.values()));
});

export const sendMessage = asyncHandler(async (req, res) => {
  const { receiverId, message } = req.body;
  const senderId = req.user.userId;

  if (!receiverId || !message || !String(message).trim()) {
    throw new ApiError(400, "Receiver and message text are required");
  }

  if (!mongoose.isValidObjectId(receiverId)) {
    throw new ApiError(400, "Invalid receiver");
  }

  if (receiverId === senderId) {
    throw new ApiError(400, "You cannot message yourself");
  }

  const receiver = await User.findById(receiverId).select("_id");
  if (!receiver) throw new ApiError(404, "Receiver not found");

  const newMessage = await Message.create({
    sender: senderId,
    receiver: receiverId,
    message: String(message).trim().slice(0, 4000),
  });

  const populated = await newMessage.populate(
    "sender receiver",
    "username email"
  );

  res.status(201).json(populated);
});
