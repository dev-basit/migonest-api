const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    members: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      required: true,
      validate: {
        validator: function (arr) {
          return Array.isArray(arr) && arr.length === 2;
        },
        message: "A conversation must have exactly two members",
      },
    },
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message", default: null },
    unreadCounts: {
      type: Map,
      of: Number,
      default: function () {
        if (this.members && this.members.length === 2) {
          return new Map([
            [this.members[0].toString(), 0],
            [this.members[1].toString(), 0],
          ]);
        }
        return new Map();
      },
    },
  },
  { timestamps: true }
);

const ConversationModel = mongoose.model("Conversation", conversationSchema);
exports.ConversationModel = ConversationModel;
