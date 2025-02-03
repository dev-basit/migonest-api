const mongoose = require("mongoose");
const { Utils } = require("../utils");

const universitySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, maxlength: 255 },
  requirements: { type: [String], default: [] },
  deadline: { type: String, minlength: 9, maxlength: 11, required: true },
  tuitionFee: { type: Number, required: true, min: 1, max: 10000000 },
  applicationFee: { type: Number, required: true, min: 1, max: 10000000 },
  documents: {
    type: [{ label: { type: String, required: true }, url: { type: String, required: true } }],
    default: [],
  },
  uniExpertId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  location: { type: String, maxlength: 255 },
  createdAt: {
    type: String,
    minlength: 9,
    maxlength: 11,
    default: () => Utils.getTimeInUnixTimestamp(),
  },
  updatedAt: {
    type: String,
    minlength: 9,
    maxlength: 11,
    default: () => Utils.getTimeInUnixTimestamp(),
  },
});

// Middleware to update updatedAt field on save
universitySchema.pre("save", function (next) {
  this.updatedAt = Utils.getTimeInUnixTimestamp();
  next();
});

const UniversityModel = mongoose.model("University", universitySchema);
exports.UniversityModel = UniversityModel;
