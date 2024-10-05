const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { config } = require("../config");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3, maxlength: 128 },
  email: { type: String, required: true, minlength: 3, maxlength: 128, unique: true },
  password: { type: String, required: true, minlength: 4, maxlength: 1024 },
  phoneNo: { type: String, required: true, minlength: 3, maxlength: 20 },
  type: { type: String, enum: ["admin", "user"], required: true },
  aboutMe: { type: String, minlength: 2, maxlength: 1024 },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, name: this.name, email: this.email, type: this.type },
    config.jwtPrivateKey
  );
  return token;
};

const UserModel = mongoose.model("User", userSchema);
exports.UserModel = UserModel;
