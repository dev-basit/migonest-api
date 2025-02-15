const mongoose = require("mongoose");
const { Utils } = require("../utils");

const becomeUniExpertSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    acceptStatus: { type: String, enum: ["open", "accepted", "rejected"], default: "open" },
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
becomeUniExpertSchema.pre("save", function (next) {
  this.updatedAt = Utils.getTimeInUnixTimestamp();
  next();
});

const BecomeUniExpertModel = mongoose.model("BecomeUniExpert", becomeUniExpertSchema);
exports.BecomeUniExpertModel = BecomeUniExpertModel;
