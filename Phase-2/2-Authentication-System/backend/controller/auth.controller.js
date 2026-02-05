import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* ================= SIGNUP ================= */
export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const role =
    email === process.env.ADMIN_EMAIL ? "admin" : "user";

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  });

  res.status(201).json({ message: "User registered successfully" });
};

/* ================= LOGIN ================= */
export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
  });

  res.json({
    message: "Login successful",
    token,
  });
};

/* ================= LOGOUT ================= */
export const logout = async (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};

/* ================= PROFILE ================= */
export const getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select("name email role");
  res.json(user);
};

/* ================= ADMIN: GET USERS ================= */
export const getAllUsers = async (req, res) => {
  const users = await User.find().select("name email role");
  res.json(users);
};

/* ================= ADMIN: DELETE USER ================= */
export const deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted successfully" });
};
