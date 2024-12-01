const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { config } = require("../config");
const { Constants } = require("../utils");

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true, minlength: 3, maxlength: 128 },
    firstName: { type: String, required: true, minlength: 3, maxlength: 128 },
    lastName: { type: String, required: true, minlength: 3, maxlength: 128 },
    profilePicture: { type: String, required: true, minlength: 1, maxlength: 2048 },
    coverPicture: { type: String, minlength: 1, maxlength: 2048 },
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
    about: { type: String, minlength: 3, maxlength: 1024 },
    experiences: [{ type: mongoose.Schema.Types.ObjectId, ref: "Experience" }],
    education: [{ type: mongoose.Schema.Types.ObjectId, ref: "Education" }],
    ielts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ielts" }],
  },
  { timestamps: true }
);

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

const experienceSchema = new mongoose.Schema({
  jobTitle: { type: String, required: true, minlength: 3, maxlength: 128 },
  company: { type: String, required: true, minlength: 3, maxlength: 128 },
  address: { type: String, required: true, minlength: 3, maxlength: 128 },
  startDate: { type: String, required: true, minlength: 9, maxlength: 11 },
  endDate: { type: String },
});

const educationSchema = new mongoose.Schema({
  institutionName: { type: String, required: true, minlength: 3, maxlength: 128 },
  address: { type: String, required: true, minlength: 3, maxlength: 128 },
  degree: { type: String, required: true, minlength: 3, maxlength: 128 },
  startDate: { type: String, required: true, minlength: 9, maxlength: 11 },
  endDate: { type: String, minlength: 9, maxlength: 11 },
  totalScore: { type: Number },
  scoreGained: { type: Number },
});

const ieltsSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3, maxlength: 128 },
  overallScore: { type: Number, min: 1 },
  listening: { type: Number, min: 1 },
  reading: { type: Number, min: 1 },
  writing: { type: Number, min: 1 },
  speaking: { type: Number, min: 1 },
  givenDate: { type: String, required: true, minlength: 9, maxlength: 11 },
});

const UserModel = mongoose.model("User", userSchema);
const ExperienceModel = mongoose.model("Experience", experienceSchema);
const EducationModel = mongoose.model("Education", educationSchema);
const IeltsModel = mongoose.model("Ielts", ieltsSchema);

exports.UserModel = UserModel;
exports.ExperienceModel = ExperienceModel;
exports.EducationModel = EducationModel;
exports.IeltsModel = IeltsModel;
