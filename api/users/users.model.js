const { required, func } = require("joi");
const mongoose = require("mongoose");
const { Schema } = mongoose;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
  verificationToken: {type: String, required: false},
});

userSchema.statics.findUserByEmail = findUserByEmail;
userSchema.methods.updateToken = updateToken;
userSchema.methods.createVerificationToken = createVerificationToken;
userSchema.statics.findByVerificationToken = findByVerificationToken;
userSchema.statics.verifyUser = verifyUser;

async function findUserByEmail(email) {
  return this.findOne({ email });
}

async function updateToken(this._id, newToken) {
  return UserModel.findByIdAndUpdate(this._id, { token: newToken });
}

async function createVerificationToken(verificationToken) {
  return UserModel.findByIdAndUpdate(this._id, 
    { verificationToken },
  { new: true }
  );
}

async function findByVerificationToken(verificationToken) {
  return this.findOne({verificationToken});
}

async function verifyUser() {
  return this.findByIdAndUpdate(
    this.id,
    {verificationToken: null},
    {new: true}
  )
}

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
