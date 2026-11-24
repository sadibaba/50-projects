import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ApiError, asyncHandler } from "../utils/http.js";

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

export const register = asyncHandler(async (req, res) => {
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

  const existingUser = await User.findOne({
    $or: [{ email: email.toLowerCase() }, { username: username.trim() }],
  });

  if (existingUser) {
    throw new ApiError(
      409,
      existingUser.email === email.toLowerCase()
        ? "Email already exists"
        : "Username already exists"
    );
  }

  const user = await User.create({
    username: username.trim(),
    email: email.toLowerCase().trim(),
    password: await bcrypt.hash(password, 10),
  });

  res.status(201).json({
    message: "User registered successfully",
    token: signToken(user._id),
    user: { id: user._id, username: user.username, email: user.email },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ApiError(401, "Invalid credentials");
  }

  res.json({
    token: signToken(user._id),
    user: { id: user._id, username: user.username, email: user.email },
  });
});
