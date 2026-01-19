import Task from "../models/task.js";

export default async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    if (task.user.toString() !== req.user) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    next();
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};