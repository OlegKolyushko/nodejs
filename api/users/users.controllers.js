
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
