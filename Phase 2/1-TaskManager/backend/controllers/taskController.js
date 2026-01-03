import Task from "../models/task.js";

export const createTask = async (req, res) => {
  try {
    const { title, description, status, deadline } = req.body;
    const task = new Task({
      title,
      description,
      status,
      deadline,
      user: req.user, 
    });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

export const getTasks = async (req, res) => {
  const tasks = await Task.find({ user: req.user });
  res.json(tasks);
};

export const updateTask = async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user },
    req.body,
    { new: true }
  );
  if (!task) return res.status(404).json({ msg: "Task not found" });
  res.json(task);
};

export const deleteTask = async (req, res) => {
  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    user: req.user,
  });
  if (!task) return res.status(404).json({ msg: "Task not found" });
  res.json({ msg: "Task deleted" });
};