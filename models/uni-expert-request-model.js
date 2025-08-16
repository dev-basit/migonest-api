const mongoose = require("mongoose");
const { Utils } = require("../utils");

const uniExpertRequestSchema = new mongoose.Schema(
  {
    uniExpertId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    universityId: { type: mongoose.Schema.Types.ObjectId, ref: "University", required: true },
    acceptStatus: { type: String, enum: ["open", "accepted", "rejected"], default: "open" },
    paymentStatus: { type: Boolean, default: false },
    stripePurchaseId: { type: String, unique: true, sparse: true },
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
  },
  { timestamps: true }
);

// Middleware to update updatedAt field on save
uniExpertRequestSchema.pre("save", function (next) {
  this.updatedAt = Utils.getTimeInUnixTimestamp();
  next();
});

const UniExpertRequestModel = mongoose.model("UniExpertRequest", uniExpertRequestSchema);
exports.UniExpertRequestModel = UniExpertRequestModel;
