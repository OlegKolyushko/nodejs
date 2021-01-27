const { Router } = require("express");
const { authorize } = require("../middelwares/authorize");
const usersController = require("./users.controllers");
const upload = require('../helpers/multerconfig');
const imageminify = require('../middelwares/imagemin');

const usersRouter = Router();

usersRouter.get("/current", authorize, usersController.getCurrentUser);

usersRouter.patch("/avatars", authorize, upload.single('avatar'), imageminify, usersController.updateAvatar);

module.exports = usersRouter;
