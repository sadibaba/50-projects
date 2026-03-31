import { Response } from "express";
import { AuthRequest } from "../types/authRequest";
import Notification from "../models/notification.model";

export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const currentUserId = req.user?.id;
    if (!currentUserId) return res.status(401).json({ error: "Unauthorized" });

    const notifications = await Notification.find({ userId: currentUserId })
      .sort({ createdAt: -1 })
      .populate("fromUser", "username email")
      .populate("pinId", "title imageUrl");

    res.json(notifications);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user?.id;

    const notification = await Notification.findOne({ _id: id, userId: currentUserId });
    if (!notification) return res.status(404).json({ error: "Notification not found" });

    notification.isRead = true;
    await notification.save();

    res.json({ message: "Notification marked as read" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
