import User from "../models/User.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // password hide
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const query = req.query.q;
    const users = await User.find({
      username: { $regex: query, $options: "i" }
    }).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
