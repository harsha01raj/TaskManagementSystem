const {
  createUser,
  getUsers,
  loginUser,
} = require("../controller/userController");
const auth = require("../middleware/auth.js");

const UserRoutes = require("express").Router();

UserRoutes.post("/", createUser);
UserRoutes.get("/getAllUser", auth, getUsers);
UserRoutes.post("/login", loginUser);

module.exports = UserRoutes;
