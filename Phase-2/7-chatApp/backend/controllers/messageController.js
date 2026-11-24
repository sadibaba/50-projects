import mongoose from "mongoose";
import Message from "../models/Message.js";
import User from "../models/User.js";
import { ApiError, asyncHandler } from "../utils/http.js";

export const sendMessage = asyncHandler(async (req, res) => {
  const { receiver, text } = req.body;
  const sender = req.user.id;

  if (!receiver || !text || !String(text).trim()) {
    throw new ApiError(400, "Receiver and message text are required");
  }

  if (!mongoose.isValidObjectId(receiver)) {
    throw new ApiError(400, "Invalid receiver");
  }

  if (receiver === sender) {
    throw new ApiError(400, "You cannot send a message to yourself");
  }

  const recipient = await User.findById(receiver).select("_id");
  if (!recipient) throw new ApiError(404, "Receiver not found");

  const message = await Message.create({
    sender,
    receiver,
    text: String(text).trim().slice(0, 4000),
  });

  res.status(201).json(message);
});

export const getMessages = asyncHandler(async (req, res) => {
  const { receiver } = req.query;
  const sender = req.user.id;

  if (!receiver) {
    throw new ApiError(400, "A receiver id is required");
  }

  if (!mongoose.isValidObjectId(receiver)) {
    throw new ApiError(400, "Invalid receiver");
  }

  const messages = await Message.find({
    $or: [
      { sender, receiver },
      { sender: receiver, receiver: sender },
    ],
  }).sort({ createdAt: 1 });

  res.json(messages);
});
