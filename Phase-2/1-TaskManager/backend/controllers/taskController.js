import Task from "../models/task.js";
import { ApiError, asyncHandler } from "../utils/http.js";

const STATUSES = ["pending", "in-progress", "completed"];
const PRIORITIES = ["low", "medium", "high"];
const CATEGORIES = ["unplanned", "withoutProject", "scheduled"];

const pickTaskFields = (body) => {
  const data = {};
  for (const field of ["title", "description", "status", "priority", "category", "deadline"]) {
    if (body[field] !== undefined) data[field] = body[field];
  }
  return data;
};

export const createTask = asyncHandler(async (req, res) => {
  const data = pickTaskFields(req.body);

  if (!data.title || !String(data.title).trim()) {
    throw new ApiError(400, "Task title is required");
  }

  if (data.status && !STATUSES.includes(data.status)) {
    throw new ApiError(400, "Invalid task status");
  }

  if (data.priority && !PRIORITIES.includes(data.priority)) {
    throw new ApiError(400, "Invalid task priority");
  }

  if (data.category && !CATEGORIES.includes(data.category)) {
    throw new ApiError(400, "Invalid task category");
  }

  const task = await Task.create({
    ...data,
    title: data.title.trim(),
    status: data.status || "pending",
    user: req.userId,
    completedAt: data.status === "completed" ? new Date() : null,
  });

  res.status(201).json(task);
});

export const getTasks = asyncHandler(async (req, res) => {
  const filter = { user: req.userId };

  if (req.query.status && STATUSES.includes(req.query.status)) {
    filter.status = req.query.status;
  }

  if (req.query.category && CATEGORIES.includes(req.query.category)) {
    filter.category = req.query.category;
  }

  const tasks = await Task.find(filter).sort({ createdAt: -1 });
  res.json(tasks);
});

export const getTaskStats = asyncHandler(async (req, res) => {
  const [total, completed, overdue] = await Promise.all([
    Task.countDocuments({ user: req.userId }),
    Task.countDocuments({ user: req.userId, status: "completed" }),
    Task.countDocuments({
      user: req.userId,
      status: { $ne: "completed" },
      deadline: { $lt: new Date() },
    }),
  ]);

  res.json({
    total,
    completed,
    pending: total - completed,
    overdue,
    completionRate: total ? Math.round((completed / total) * 100) : 0,
  });
});

export const updateTask = asyncHandler(async (req, res) => {
  const data = pickTaskFields(req.body);

  if (data.status && !STATUSES.includes(data.status)) {
    throw new ApiError(400, "Invalid task status");
  }

  if (data.priority && !PRIORITIES.includes(data.priority)) {
    throw new ApiError(400, "Invalid task priority");
  }

  if (data.category && !CATEGORIES.includes(data.category)) {
    throw new ApiError(400, "Invalid task category");
  }

  if (data.status === "completed") {
    data.completedAt = new Date();
  } else if (data.status) {
    data.completedAt = null;
  }

  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.userId },
    data,
    { new: true, runValidators: true }
  );

  if (!task) throw new ApiError(404, "Task not found");
  res.json(task);
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    user: req.userId,
  });

  if (!task) throw new ApiError(404, "Task not found");
  res.json({ message: "Task deleted" });
});
