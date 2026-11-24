import { Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { AsyncRequest } from "../types/authRequest";
import { ApiError, asyncHandler, publicUser } from "../utils/http";

const sign = (id: string) =>
  jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as jwt.SignOptions["expiresIn"],
  });

const usernamePattern = /^[a-z0-9_]{3,30}$/;

export const register = asyncHandler(async (req: AsyncRequest, res: Response) => {
  const username = String(req.body.username || "").trim().toLowerCase();
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");

  if (!usernamePattern.test(username)) {
    throw new ApiError(400, "Username must be 3-30 characters and use letters, numbers or underscores");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new ApiError(400, "Enter a valid email address");
  if (password.length < 8) throw new ApiError(400, "Password must be at least 8 characters");

  const exists = await User.findOne({ $or: [{ username }, { email }] });
  if (exists) {
    throw new ApiError(409, exists.email === email ? "An account with this email already exists" : "That username is taken");
  }

  const user = await User.create({
    username,
    name: req.body.name || username,
    email,
    password: await bcrypt.hash(password, 12),
  });

  res.status(201).json({ token: sign(String(user._id)), user: publicUser(user, true) });
});

export const login = asyncHandler(async (req: AsyncRequest, res: Response) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  if (!email || !password) throw new ApiError(400, "Email and password are required");

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  res.json({ token: sign(String(user._id)), user: publicUser(user, true) });
});

export const me = asyncHandler(async (req: AsyncRequest, res: Response) => {
  const user = await User.findById(req.userId);
  if (!user) throw new ApiError(404, "User not found");
  res.json(publicUser(user, true));
});

export const updateMe = asyncHandler(async (req: AsyncRequest, res: Response) => {
  const allowed = ["name", "bio", "avatar", "cover", "website", "location", "username"];
  const updates: any = {};
  for (const field of allowed) {
    if (req.body[field] !== undefined) updates[field] = String(req.body[field]).trim();
  }

  if (updates.username) {
    updates.username = updates.username.toLowerCase();
    if (!usernamePattern.test(updates.username)) throw new ApiError(400, "Invalid username");
    const taken = await User.findOne({ username: updates.username, _id: { $ne: req.userId } });
    if (taken) throw new ApiError(409, "That username is taken");
  }

  const user = await User.findByIdAndUpdate(req.userId, updates, { new: true, runValidators: true });
  if (!user) throw new ApiError(404, "User not found");
  res.json(publicUser(user, true));
});

export const changePassword = asyncHandler(async (req: AsyncRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) throw new ApiError(400, "Current and new password are required");
  if (String(newPassword).length < 8) throw new ApiError(400, "Password must be at least 8 characters");

  const user = await User.findById(req.userId).select("+password");
  if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
    throw new ApiError(401, "Current password is incorrect");
  }
  user.password = await bcrypt.hash(newPassword, 12);
  await user.save();
  res.json({ message: "Password updated" });
});
