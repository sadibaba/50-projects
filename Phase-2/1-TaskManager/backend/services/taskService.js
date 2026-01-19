import Task from "../models/task.js";

export const createTaskService = async (data) => {
  const task = new Task(data);
  return await task.save();
};

export const getTasksService = async (userId) => {
  return await Task.find({ user: userId });
};

export const updateTaskService = async (taskId, userId, updateData) => {
  return await Task.findOneAndUpdate(
    { _id: taskId, user: userId },
    updateData,
    { new: true }
  );
};

export const deleteTaskService = async (taskId, userId) => {
  return await Task.findOneAndDelete({ _id: taskId, user: userId });
};