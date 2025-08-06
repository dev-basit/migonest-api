const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    uniExpertRequestId: { type: mongoose.Schema.Types.ObjectId, ref: "UniExpertRequest" },
    subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: "Subscription" },
    type: { type: String, required: true, enum: ["uniExpertRequest", "subscription"] },
    amount: { type: Number, required: true },
    stripePurchaseId: { type: String, required: true, unique: true },
    purchaseDate: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
);

const PurchaseModel = mongoose.model("Purchase", purchaseSchema);
exports.PurchaseModel = PurchaseModel;
