import { Response } from "express";
import Pin from "../models/pin.model";
import Board from "../models/board.model";
import User from "../models/user.model";
import { AsyncRequest } from "../types/authRequest";
import { asyncHandler } from "../utils/http";

export const search = asyncHandler(async (req: AsyncRequest, res: Response) => {
  const q = String(req.query.q || "").trim();
  if (!q) return res.json({ pins: [], boards: [], users: [] });

  const regex = { $regex: q, $options: "i" };
  const [pins, boards, users] = await Promise.all([
    Pin.find({ $or: [{ title: regex }, { description: regex }, { tags: regex }, { category: regex }] })
      .populate("createdBy", "username name avatar")
      .limit(40)
      .lean(),
    Board.find({ isSecret: false, $or: [{ name: regex }, { description: regex }] })
      .populate("createdBy", "username name avatar")
      .populate("pins", "imageUrl title")
      .limit(12)
      .lean(),
    User.find({ $or: [{ username: regex }, { name: regex }] })
      .select("username name avatar bio followers")
      .limit(12)
      .lean(),
  ]);

  res.json({ pins, boards, users });
});
