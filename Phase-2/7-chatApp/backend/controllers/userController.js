import User from "../models/User.js";
import { asyncHandler } from "../utils/http.js";

export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ _id: { $ne: req.user.id } })
    .select("username email createdAt")
    .sort({ username: 1 });
  res.json(users);
});

export const searchUsers = asyncHandler(async (req, res) => {
  const query = String(req.query.q || "").trim();
  if (!query) return res.json([]);

  const users = await User.find({
    _id: { $ne: req.user.id },
    $or: [
      { username: { $regex: query, $options: "i" } },
      { email: { $regex: query, $options: "i" } },
    ],
  })
    .select("username email createdAt")
    .limit(25);

  res.json(users);
});
