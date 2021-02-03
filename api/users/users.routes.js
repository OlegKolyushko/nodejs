const { Router } = require("express");
const { authorize } = require("../middelwares/authorize");
const usersController = require("./users.controllers");

const usersRouter = Router();

usersRouter.get("/current", authorize, usersController.getCurrentUser);

module.exports = usersRouter;
