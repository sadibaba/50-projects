import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Note from "../models/Note.js";
import Tag from "../models/Tag.js";
import { ApiError, asyncHandler } from "../utils/http.js";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

const publicUser = (user) => ({
  _id: user._id,
  username: user.username,
  email: user.email,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new ApiError(400, "Username, email and password are required");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ApiError(400, "Enter a valid email address");
  }

  if (String(password).length < 8) {
    throw new ApiError(400, "Password must be at least 8 characters");
  }

  const existing = await User.findOne({
    $or: [{ email: email.toLowerCase() }, { username: username.trim() }],
  });

  if (existing) {
    throw new ApiError(
      409,
      existing.email === email.toLowerCase()
        ? "An account with this email already exists"
        : "This username is already taken"
    );
  }

  const user = await User.create({
    username: username.trim(),
    email: email.toLowerCase().trim(),
    password,
  });

  res.status(201).json({ ...publicUser(user), token: generateToken(user._id) });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password"
  );

  if (!user || !(await user.matchPassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  res.json({ ...publicUser(user), token: generateToken(user._id) });
});

export const getUserProfile = asyncHandler(async (req, res) => {
  res.json(publicUser(req.user));
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { username } = req.body;

  if (!username || !String(username).trim()) {
    throw new ApiError(400, "Username cannot be empty");
  }

  const taken = await User.findOne({
    username: String(username).trim(),
    _id: { $ne: req.user._id },
  });

  if (taken) throw new ApiError(409, "This username is already taken");

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { username: String(username).trim() },
    { new: true, runValidators: true }
  );

  res.json(publicUser(user));
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ApiError(400, "Current and new password are required");
  }

  if (String(newPassword).length < 8) {
    throw new ApiError(400, "Password must be at least 8 characters");
  }

  const user = await User.findById(req.user._id).select("+password");
  if (!(await user.matchPassword(currentPassword))) {
    throw new ApiError(401, "Current password is incorrect");
  }

  user.password = newPassword;
  await user.save();

  res.json({ message: "Password changed successfully" });
});

export const deleteAccount = asyncHandler(async (req, res) => {
  await Promise.all([
    Note.deleteMany({ user: req.user._id }),
    Tag.deleteMany({ user: req.user._id }),
  ]);
  await User.findByIdAndDelete(req.user._id);
  res.json({ message: "Account and all notes were deleted" });
});
