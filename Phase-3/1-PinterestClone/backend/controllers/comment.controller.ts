import { Response } from "express";
import Comment from "../models/comments";
import Pin from "../models/pin.model";
import { AsyncRequest } from "../types/authRequest";
import { ApiError, asyncHandler } from "../utils/http";
import { notify } from "../utils/notify";

export const getComments = asyncHandler(async (req: AsyncRequest, res: Response) => {
  const comments = await Comment.find({ pin: req.params.id })
    .populate("user", "username name avatar")
    .sort({ createdAt: -1 })
    .lean();
  res.json(comments);
});

export const addComment = asyncHandler(async (req: AsyncRequest, res: Response) => {
  if (!req.userId) throw new ApiError(401, "Authentication required");
  const text = String(req.body.text || "").trim();
  if (!text) throw new ApiError(400, "Comment text is required");

  const pin = await Pin.findById(req.params.id);
  if (!pin) throw new ApiError(404, "Pin not found");

  const comment = await Comment.create({ text, user: req.userId, pin: pin._id });
  pin.commentsCount = (pin.commentsCount || 0) + 1;
  await pin.save();
  await notify({ recipient: String(pin.createdBy), actor: req.userId, type: "comment", pin: String(pin._id) });

  const populated = await Comment.findById(comment._id)
    .populate("user", "username name avatar")
    .lean();

  res.status(201).json(populated);
});

export const deleteComment = asyncHandler(async (req: AsyncRequest, res: Response) => {
  if (!req.userId) throw new ApiError(401, "Authentication required");
  const comment = await Comment.findById(req.params.id);
  if (!comment) throw new ApiError(404, "Comment not found");

  const pin = await Pin.findById(comment.pin);
  const isOwner = String(comment.user) === req.userId;
  const isPinOwner = pin && String(pin.createdBy) === req.userId;
  if (!isOwner && !isPinOwner) throw new ApiError(403, "You cannot delete this comment");

  await comment.deleteOne();
  if (pin) {
    pin.commentsCount = Math.max(0, (pin.commentsCount || 1) - 1);
    await pin.save();
  }
  res.json({ message: "Comment deleted" });
});
