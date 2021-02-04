const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatarURL: {type: String, required: true},
  subscription: {
    type: String,
    enum: ["free", "pro", "premium"],
    default: "free",
  },
  token: { type: String, default: "" },
});

userSchema.statics.findUserByEmail = findUserByEmail;
userSchema.methods.updateToken = updateToken;
userSchema.statics.hashPassword = hashPassword;
userSchema.methods.validUser = validUser;

async function findUserByEmail(email) {
  return this.findOne({ email });
}

async function updateToken(newToken) {
  return UserModel.findByIdAndUpdate(this._id, { token: newToken });
}

function hashPassword(password) {
  return bcrypt.hash(password, 4);
}

async function validUser(password) {

  const validPassword = await bcrypt.compare(password, this.password);

  if (!validPassword) {
    return res.status(401).send("Authenticaction failed");
  }

  const token = jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
    expiresIn: 2 * 24 * 60 * 60,
  });

  await this.updateToken(token);

  return token;
}

function hashPassword(password) {
  return bcrypt.hash(password, 4);
}

async function validUser(password) {

  const validPassword = await bcrypt.compare(password, this.password);

  if (!validPassword) {
    return res.status(401).send("Authenticaction failed");
  }

  const token = jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
    expiresIn: 2 * 24 * 60 * 60,
  });

  await this.updateToken(token);

  return token;
}

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
