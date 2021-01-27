const Joi = require("joi");
const jwt = require("jsonwebtoken");
const usersModel = require("./users.model");

class UserController {
  async getCurrentUser(req, res, next) {
    try {
      const { email, subscription } = req.user;
      return res.status(200).send({ email, subscription });
    } catch (error) {
      next(error);
    }
  }

  async updateAvatar(req, res, next) {
    try {
      const { filename } = req.file;
      const updatedUser = await usersModel.findByIdAndUpdate(req.user._id, {
        $set: { avatarURL: `http://localhost:3000/images/${filename}` },
      }, {new: true});
      return res.status(200).send({avatarURL: updatedUser.avatarURL});
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
