import User from "../models/user_model.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/http.js";

const signToken = (user) =>
  jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

const publicUser = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
});

export const register = async ({ username, email, password }) => {
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
    password,
  });

  return {
    success: true,
    message: "User registered successfully",
    token: signToken(user),
    user: publicUser(user),
  };
};

export const login = async ({ email, password }) => {
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid credentials");
  }

  return {
    success: true,
    message: "Login successful",
    token: signToken(user),
    user: publicUser(user),
  };
};
