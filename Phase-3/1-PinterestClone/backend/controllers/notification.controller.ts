import { Response } from "express";
import Notification from "../models/notification.model";
import { AsyncRequest } from "../types/authRequest";
import { asyncHandler } from "../utils/http";

export const list = asyncHandler(async (req: AsyncRequest, res: Response) => {
  const notifications = await Notification.find({ recipient: req.userId })
    .populate("actor", "username name avatar")
    .populate("pin", "title imageUrl")
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();
  const unread = await Notification.countDocuments({ recipient: req.userId, read: false });
  res.json({ notifications, unread });
});

export const markRead = asyncHandler(async (req: AsyncRequest, res: Response) => {
  await Notification.updateOne({ _id: req.params.id, recipient: req.userId }, { read: true });
  res.json({ message: "Marked as read" });
});

export const markAllRead = asyncHandler(async (req: AsyncRequest, res: Response) => {
  await Notification.updateMany({ recipient: req.userId, read: false }, { read: true });
  res.json({ message: "All notifications marked as read" });
});
