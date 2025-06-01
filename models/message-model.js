const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["text", "image", "video"], default: "text", required: true },
    message: { type: String, required: true, minlength: 1, maxlength: 10000 },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation", required: true },
  },
  { timestamps: true }
);

const MessageModel = mongoose.model("Message", messageSchema);
exports.MessageModel = MessageModel;
