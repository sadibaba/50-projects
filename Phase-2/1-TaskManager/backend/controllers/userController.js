import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Task from "../models/task.js";
import { ApiError, asyncHandler } from "../utils/http.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 8;
const RESET_TOKEN_TTL_MS = 15 * 60 * 1000;

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  location: user.location,
  website: user.website,
  bio: user.bio,
  settings: user.settings,
  lastLoginAt: user.lastLoginAt,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const issueToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const hashResetToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "Name, email and password are required");
  }

  if (!EMAIL_PATTERN.test(email)) {
    throw new ApiError(400, "Enter a valid email address");
  }

  if (String(password).length < PASSWORD_MIN_LENGTH) {
    throw new ApiError(
      400,
      `Password must be at least ${PASSWORD_MIN_LENGTH} characters`
    );
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw new ApiError(409, "An account with this email already exists");
  }

  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: await bcrypt.hash(password, 12),
    lastLoginAt: new Date(),
  });

  res.status(201).json({ token: issueToken(user), user: publicUser(user) });
});

export const loginUser = asyncHandler(async (req, res) => {
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

  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  res.json({ token: issueToken(user), user: publicUser(user) });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  const response = {
    message:
      "If an account exists for this email, a password reset link has been generated.",
  };

  if (!user) {
    return res.json(response);
  }

  const token = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = hashResetToken(token);
  user.resetPasswordExpires = new Date(Date.now() + RESET_TOKEN_TTL_MS);
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password/${token}`;

  // No mail provider is configured in this learning project. The link is logged
  // and, outside production, returned so the flow can be tested end to end.
  console.info(`[password-reset] ${user.email}: ${resetUrl}`);

  if (process.env.NODE_ENV !== "production") {
    response.resetUrl = resetUrl;
  }

  res.json(response);
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    throw new ApiError(400, "Reset token and new password are required");
  }

  if (String(password).length < PASSWORD_MIN_LENGTH) {
    throw new ApiError(
      400,
      `Password must be at least ${PASSWORD_MIN_LENGTH} characters`
    );
  }

  const user = await User.findOne({
    resetPasswordToken: hashResetToken(token),
    resetPasswordExpires: { $gt: new Date() },
  }).select("+resetPasswordToken +resetPasswordExpires");

  if (!user) {
    throw new ApiError(400, "Reset link is invalid or has expired");
  }

  user.password = await bcrypt.hash(password, 12);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ message: "Password updated. You can now sign in." });
});

export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) throw new ApiError(404, "User not found");
  res.json(publicUser(user));
});

export const updateProfile = asyncHandler(async (req, res) => {
  const allowed = ["name", "phone", "location", "website", "bio"];
  const updates = {};

  for (const field of allowed) {
    if (req.body[field] !== undefined) {
      updates[field] = String(req.body[field]).trim();
    }
  }

  if (updates.name !== undefined && !updates.name) {
    throw new ApiError(400, "Name cannot be empty");
  }

  const user = await User.findByIdAndUpdate(req.userId, updates, {
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

  if (String(newPassword).length < PASSWORD_MIN_LENGTH) {
    throw new ApiError(
      400,
      `Password must be at least ${PASSWORD_MIN_LENGTH} characters`
    );
  }

  const user = await User.findById(req.userId).select("+password");
  if (!user) throw new ApiError(404, "User not found");

  if (!(await bcrypt.compare(currentPassword, user.password))) {
    throw new ApiError(401, "Current password is incorrect");
  }

  user.password = await bcrypt.hash(newPassword, 12);
  await user.save();

  res.json({ message: "Password changed successfully" });
});

export const updateSettings = asyncHandler(async (req, res) => {
  const allowed = ["emailNotifications", "pushNotifications", "language", "theme", "privacy"];
  const incoming = req.body.settings || req.body;
  const settings = {};

  for (const field of allowed) {
    if (incoming[field] !== undefined) {
      settings[field] = incoming[field];
    }
  }

  const user = await User.findByIdAndUpdate(
    req.userId,
    { $set: Object.fromEntries(Object.entries(settings).map(([key, value]) => [`settings.${key}`, value])) },
    { new: true, runValidators: true }
  );

  if (!user) throw new ApiError(404, "User not found");
  res.json(publicUser(user));
});

export const deleteAccount = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) throw new ApiError(404, "User not found");

  await Task.deleteMany({ user: user._id });
  await user.deleteOne();

  res.json({ message: "Account and all associated tasks were deleted" });
});

export const getStats = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) throw new ApiError(404, "User not found");

  const [totalTasks, completedTasks, pendingTasks, overdueTasks, activeDays] =
    await Promise.all([
      Task.countDocuments({ user: req.userId }),
      Task.countDocuments({ user: req.userId, status: "completed" }),
      Task.countDocuments({ user: req.userId, status: { $ne: "completed" } }),
      Task.countDocuments({
        user: req.userId,
        status: { $ne: "completed" },
        deadline: { $lt: new Date() },
      }),
      Task.distinct("createdAt", { user: req.userId }).then(
        (dates) =>
          new Set(dates.map((date) => new Date(date).toISOString().slice(0, 10)))
            .size
      ),
    ]);

  res.json({
    totalTasks,
    completedTasks,
    pendingTasks,
    overdueTasks,
    completionRate: totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0,
    activeDays,
    memberSince: user.createdAt,
  });
});
