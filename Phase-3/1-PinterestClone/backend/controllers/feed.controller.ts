import { Response } from "express";
import { AuthRequest } from "../types/authRequest";
import Pin from "../models/pin.model";

export const getFeed = async (req: AuthRequest, res: Response) => {
  try {
    const currentUserId = req.user?.id;
    if (!currentUserId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Current user ke following list fetch karo
    const currentUser = await (await import("../models/user.model")).default.findById(currentUserId);
    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Personalized feed: pins from followed users
    const feed = await Pin.find({ createdBy: { $in: currentUser.following } })
      .sort({ createdAt: -1 })
      .populate("createdBy");

    res.json(feed);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
