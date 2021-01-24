const { Router } = require("express");
const authControllers = require("./auth.controllers");
const { authorize } = require("../../middelwares/authorize");

const authRouters = Router();

authRouters.post(
  "/register",
  authControllers.validateCreateUser,
  authControllers.createUser
);

authRouters.post(
  "/login",
  authControllers.validateCreateUser,
  authControllers.login
);

authRouters.delete("/logout", authorize, authControllers.logout);

module.exports = authRouters;
