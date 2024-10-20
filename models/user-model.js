const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { config } = require("../config");
const { Constants } = require("../utils");

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true, minlength: 3, maxlength: 128 },
  firstName: { type: String, required: true, minlength: 3, maxlength: 128 },
  lastName: { type: String, required: true, minlength: 3, maxlength: 128 },
  profilePicture: { type: String, required: true, minlength: 1, maxlength: 2048 },
  email: { type: String, required: true, minlength: 3, maxlength: 128, unique: true },
  password: { type: String, required: true, minlength: 4, maxlength: 1024 },
  date: { type: String, required: true, minlength: 9, maxlength: 11 }, // store in unix timestamp
  gender: { type: String, enum: ["male", "female", "other"], required: true },
  type: { type: String, enum: Constants.USER_TYPES, required: true },
  isVerified: { type: Boolean, default: false },
  emailVerificationCode: { type: String, minlength: 6, maxlength: 6 },
  preferences: { type: String, minlength: 0, maxlength: 3072, default: "{}" },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // List of followers
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      username: this.userName,
      name: this.firstName + " " + this.lastName,
      email: this.email,
      type: this.type,
      profilePicture: this.profilePicture,
      preferences: this.preferences,
    },
    config.jwtPrivateKey
  );
  return token;
};

const UserModel = mongoose.model("User", userSchema);
exports.UserModel = UserModel;
