const mongoose = require("mongoose");
const { Utils } = require("../utils");

const admissionSchema = new mongoose.Schema(
  {
    step: { type: Number, min: 0, max: 8, default: 0 },
    uniExpertRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UniExpertRequest",
      required: true,
    },
    documents: {
      type: [{ label: { type: String, required: true }, url: { type: String, required: true } }],
      default: [],
    },
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
admissionSchema.pre("save", function (next) {
  this.updatedAt = Utils.getTimeInUnixTimestamp();
  next();
});

const AdmissionModel = mongoose.model("Admission", admissionSchema);
exports.AdmissionModel = AdmissionModel;
