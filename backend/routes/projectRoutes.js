const ProjectRoutes = require("express").Router();
const {
  createProject,
  getAllProjects,
  updateProject,
  deleteProject,
  getProjectById,
} = require("../controller/projectManagementController");
const auth = require("../middleware/auth.js");
console.log("Project routes loaded");   

ProjectRoutes.post("/", auth, createProject);
ProjectRoutes.post("/getAllProjects", auth, getAllProjects);
ProjectRoutes.get("/getProjectById/:id", auth, getProjectById);
ProjectRoutes.put("/updateProject/:id", auth, updateProject);
ProjectRoutes.delete("/deleteProjectById/:id", auth, deleteProject);

module.exports = ProjectRoutes;
