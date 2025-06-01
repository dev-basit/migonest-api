const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["request", "message", "alert"], default: "request" },
    message: { type: String, required: true, minlength: 1, maxlength: 1000 },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const NotificationModel = mongoose.model("Notification", notificationSchema);
exports.NotificationModel = NotificationModel;
