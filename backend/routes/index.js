const Router = require("express");
const UserRoutes = require("./userRoutes");
const ProjectRoutes = require("./projectRoutes");
const TaskRoutes = require("./taskRotues.js");

const router = Router();

router.use("/api/user", UserRoutes);
router.use("/api/project", ProjectRoutes);
router.use("/api/task", TaskRoutes);

module.exports = router;
