import User from "../models/User.js";

export const getUsers = async (req, res) => {
  try {
    console.log("Fetching all users");
    const users = await User.find().select("-password");
    console.log(`Found ${users.length} users`);
    res.json(users);
  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).json({ error: err.message || "Server error" });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const query = req.query.q;
    console.log("Searching users with query:", query);
    
    if (!query) {
      return res.json([]);
    }
    
    const users = await User.find({
      username: { $regex: query, $options: "i" }
    }).select("-password");
    
    console.log(`Found ${users.length} users matching "${query}"`);
    res.json(users);
  } catch (err) {
    console.error("Search users error:", err);
    res.status(500).json({ error: err.message || "Server error" });
  }
};