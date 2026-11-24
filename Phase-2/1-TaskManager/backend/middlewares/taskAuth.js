import Task from "../models/task.js";
import { ApiError } from "../utils/http.js";

export default async function taskAuth(req, res, next) {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return next(new ApiError(404, "Task not found"));
  }

  if (task.user.toString() !== req.userId.toString()) {
    return next(new ApiError(403, "You do not have access to this task"));
  }

  req.task = task;
  next();
}
