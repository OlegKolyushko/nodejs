const { Router } = require("express");
const authControllers = require("./auth.controllers");
const { authorize } = require("../../middelwares/authorize");

const authRouters = Router();

authRouters.post(
  "/register",
  authControllers.validateUser,
  authControllers.createUser
);

authRouters.post(
  "/login",
  authControllers.validateUser,
  authControllers.login
);

authRouters.delete("/logout", authorize, authControllers.logout);

module.exports = authRouters;
