import express from "express";
import {
  createTask,
  getTasks,
  getTaskStats,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.use(auth);

router.route("/").post(createTask).get(getTasks);
router.get("/stats", getTaskStats);
router.route("/:id").put(updateTask).delete(deleteTask);

export default router;
