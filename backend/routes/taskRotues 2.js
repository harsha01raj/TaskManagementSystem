const TaskRoutes = require("express").Router();

const {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
} = require("../controller/taskController.js");
const auth = require("../middleware/auth.js");

TaskRoutes.post("/", auth, createTask);
TaskRoutes.post("/getAllTasks", auth, getAllTasks);
TaskRoutes.put("/updateTask/:id", auth, updateTask);
TaskRoutes.delete("/deleteTaskById/:id", auth, deleteTask);

module.exports = TaskRoutes;
