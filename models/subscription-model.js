const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    planType: { type: String, enum: ["MONTH", "YEAR"], default: "MONTH" },
    stripeSubscriptionId: { type: String, required: true, unique: true },
    status: { type: String, required: true },
    currentPeriodStart: { type: Date, required: true },
    currentPeriodEnd: { type: Date, required: true },
    cancelAtPeriodEnd: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const SubscriptionModel = mongoose.model("Subscription", subscriptionSchema);
exports.SubscriptionModel = SubscriptionModel;
