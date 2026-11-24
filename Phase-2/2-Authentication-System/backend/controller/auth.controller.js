import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import { ApiError, asyncHandler, publicUser } from "../utils/http.js";

const ACTIVE_WINDOW_DAYS = 7;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "Name, email and password are required");
  }

  if (!EMAIL_PATTERN.test(email)) {
    throw new ApiError(400, "Enter a valid email address");
  }

  if (String(password).length < 8) {
    throw new ApiError(400, "Password must be at least 8 characters");
  }

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) {
    throw new ApiError(409, "An account with this email already exists");
  }

  const role =
    process.env.ADMIN_EMAIL &&
    email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase()
      ? "admin"
      : "user";

  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: await bcrypt.hash(password, 10),
    role,
  });

  res.status(201).json({
    message: "Account created successfully",
    user: publicUser(user),
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password"
  );

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  user.lastActiveAt = new Date();
  await user.save({ validateBeforeSave: false });

  res.cookie("token", signToken(user), cookieOptions());

  res.json({
    message: "Login successful",
    token: signToken(user),
    user: publicUser(user),
  });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token", { ...cookieOptions(), maxAge: undefined });
  res.json({ message: "Logged out successfully" });
});

export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) throw new ApiError(404, "User not found");
  res.json(publicUser(user));
});

export const updateProfile = asyncHandler(async (req, res) => {
  const updates = {};

  if (req.body.name !== undefined) {
    if (!String(req.body.name).trim()) {
      throw new ApiError(400, "Name cannot be empty");
    }
    updates.name = String(req.body.name).trim();
  }

  if (req.body.bio !== undefined) {
    updates.bio = String(req.body.bio).trim().slice(0, 300);
  }

  const user = await User.findByIdAndUpdate(req.user.id, updates, {
    new: true,
    runValidators: true,
  });

  if (!user) throw new ApiError(404, "User not found");
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

  const user = await User.findById(req.user.id).select("+password");
  if (!user) throw new ApiError(404, "User not found");

  if (!(await bcrypt.compare(currentPassword, user.password))) {
    throw new ApiError(401, "Current password is incorrect");
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.json({ message: "Password changed successfully" });
});

export const getAdminStats = asyncHandler(async (req, res) => {
  const activeSince = new Date(
    Date.now() - ACTIVE_WINDOW_DAYS * 24 * 60 * 60 * 1000
  );
  const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [totalUsers, adminUsers, activeUsers, newUsers] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: "admin" }),
    User.countDocuments({ lastActiveAt: { $gte: activeSince } }),
    User.countDocuments({ createdAt: { $gte: monthAgo } }),
  ]);

  res.json({ totalUsers, adminUsers, activeUsers, newUsers, activeWindowDays: ACTIVE_WINDOW_DAYS });
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
  const search = String(req.query.q || "").trim();

  const filter = search
    ? {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    User.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    User.countDocuments(filter),
  ]);

  res.json({
    users: users.map(publicUser),
    pagination: {
      page,
      limit,
      total,
      pages: Math.max(Math.ceil(total / limit), 1),
    },
  });
});

export const deleteUser = asyncHandler(async (req, res) => {
  if (req.params.id === req.user.id) {
    throw new ApiError(400, "You cannot delete your own account from the admin panel");
  }

  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, "User not found");

  if (user.role === "admin" && (await User.countDocuments({ role: "admin" })) <= 1) {
    throw new ApiError(400, "The last administrator account cannot be deleted");
  }

  await user.deleteOne();
  res.json({ message: "User deleted successfully" });
});
