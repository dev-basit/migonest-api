const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    uniExpertRequestId: { type: mongoose.Schema.Types.ObjectId, ref: "UniExpertRequest", required: true },
    amount: { type: Number, required: true },
    purchaseDate: { type: Date, required: true, default: Date.now },
    stripePurchaseId: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const PurchaseModel = mongoose.model("Purchase", purchaseSchema);
exports.PurchaseModel = PurchaseModel;
