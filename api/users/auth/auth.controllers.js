const Joi = require("joi");
const userModel = require("../users.model");
const avatarGenerator = require("../../utils/avatargenerator");

class AuthControllers {
  async createUser(req, res, next) {
    try {
      const { email, password } = req.body;
      const existingUser = await userModel.findUserByEmail(email);
      if (existingUser) {
        return res.status(409).send({ message: "Email in use" });
      }
      const passwordHash = await userModel.hashPassword(password);
      const avatar = await avatarGenerator();
      const avatarLink = `http://localhost:3000/images/${avatar}`;
      const {
        _id: id,
        email: userEmail,
        subscription,
        token,
        avatarURL,
      } = await userModel.create({
        email,
        password: passwordHash,
        avatarURL: avatarLink,
      });
      return res.status(201).send({
        user: {
          email: userEmail,
          subscription,
          avatarURL,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await userModel.findUserByEmail(email);
      if (!user) {
        return res.status(401).send("Authenticaction failed");
      }
      const token = await user.validUser(password);
      res.status(200).send({
        token,
        user: {
          id: user._id,
          email: user.email,
          subscription: user.subscription,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      const user = req.user;
      await user.updateToken(user._id, null);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  validateUser(req, res, next) {
    const createUserRules = Joi.object({
      email: Joi.string().email().min(1).required(),
      password: Joi.string().min(6).required(),
    });
    const result = createUserRules.validate(req.body);

    if (result.error) {
      return res.status(400).json({ message: result.error });
    }
    next();
  }
}

module.exports = new AuthControllers();
