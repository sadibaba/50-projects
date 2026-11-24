import { Response } from "express";
import mongoose from "mongoose";
import User from "../models/user.model";
import Pin from "../models/pin.model";
import Board from "../models/board.model";
import { AsyncRequest } from "../types/authRequest";
import { ApiError, asyncHandler, publicUser } from "../utils/http";
import { notify } from "../utils/notify";

const findUser = async (value: string) => {
  if (mongoose.isValidObjectId(value)) {
    const byId = await User.findById(value);
    if (byId) return byId;
  }
  return User.findOne({ username: value.toLowerCase() });
};

export const getProfile = asyncHandler(async (req: AsyncRequest, res: Response) => {
  const user = await findUser(String(req.params.id));
  if (!user) throw new ApiError(404, "User not found");

  const isOwn = String(user._id) === req.userId;
  const [pins, boards, followers, following] = await Promise.all([
    Pin.find({ createdBy: user._id }).populate("createdBy", "username name avatar").sort({ createdAt: -1 }).lean(),
    Board.find({ createdBy: user._id, ...(isOwn ? {} : { isSecret: false }) }).populate("pins", "imageUrl title").lean(),
    User.find({ _id: { $in: user.followers } }).select("username name avatar").lean(),
    User.find({ _id: { $in: user.following } }).select("username name avatar").lean(),
  ]);

  const saved = isOwn
    ? await Pin.find({ saves: user._id }).populate("createdBy", "username name avatar").sort({ createdAt: -1 }).lean()
    : [];

  res.json({
    user: publicUser(user, isOwn),
    pins,
    boards: boards.map((board) => ({ ...board, pinsCount: board.pins?.length || 0 })),
    saved,
    followers,
    following,
    followersCount: user.followers.length,
    followingCount: user.following.length,
    totalLikes: pins.reduce((total: number, pin: any) => total + (pin.likes?.length || 0), 0),
    isFollowing: Boolean(req.userId && user.followers.some((id) => String(id) === req.userId)),
  });
});

export const follow = asyncHandler(async (req: AsyncRequest, res: Response) => {
  if (!req.userId) throw new ApiError(401, "Authentication required");
  if (String(req.params.id) === req.userId) throw new ApiError(400, "You cannot follow yourself");

  const target = await User.findById(req.params.id);
  const current = await User.findById(req.userId);
  if (!target || !current) throw new ApiError(404, "User not found");

  if (!target.followers.some((id) => String(id) === req.userId)) {
    target.followers.push(new mongoose.Types.ObjectId(req.userId));
    current.following.push(target._id);
    await Promise.all([target.save(), current.save()]);
    await notify({ recipient: String(target._id), actor: req.userId, type: "follow" });
  }

  res.json({ following: true, followersCount: target.followers.length });
});

export const unfollow = asyncHandler(async (req: AsyncRequest, res: Response) => {
  if (!req.userId) throw new ApiError(401, "Authentication required");
  const target = await User.findById(req.params.id);
  const current = await User.findById(req.userId);
  if (!target || !current) throw new ApiError(404, "User not found");

  target.followers = target.followers.filter((id) => String(id) !== req.userId);
  current.following = current.following.filter((id) => String(id) !== req.params.id);
  await Promise.all([target.save(), current.save()]);
  res.json({ following: false, followersCount: target.followers.length });
});

export const followers = asyncHandler(async (req: AsyncRequest, res: Response) => {
  const user = await findUser(String(req.params.id));
  if (!user) throw new ApiError(404, "User not found");
  const list = await User.find({ _id: { $in: user.followers } }).select("username name avatar bio").lean();
  res.json(list);
});

export const following = asyncHandler(async (req: AsyncRequest, res: Response) => {
  const user = await findUser(String(req.params.id));
  if (!user) throw new ApiError(404, "User not found");
  const list = await User.find({ _id: { $in: user.following } }).select("username name avatar bio").lean();
  res.json(list);
});

export const searchUsers = asyncHandler(async (req: AsyncRequest, res: Response) => {
  const q = String(req.query.q || "").trim();
  if (!q) return res.json([]);
  const users = await User.find({
    $or: [{ username: { $regex: q, $options: "i" } }, { name: { $regex: q, $options: "i" } }],
  })
    .select("username name avatar bio followers")
    .limit(12)
    .lean();
  res.json(users);
});

export const savedPins = asyncHandler(async (req: AsyncRequest, res: Response) => {
  if (!req.userId) throw new ApiError(401, "Authentication required");
  const pins = await Pin.find({ saves: req.userId }).populate("createdBy", "username name avatar").sort({ createdAt: -1 }).lean();
  res.json(pins);
});
