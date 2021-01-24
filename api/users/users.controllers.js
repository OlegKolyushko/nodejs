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
  
}

module.exports = new UserController();
