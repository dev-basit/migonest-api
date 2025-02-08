const mongoose = require("mongoose");
const { Utils } = require("../utils");

const postSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true, minlength: 1, maxlength: 1024 },
    picture: { type: String, default: "", maxlength: 1024 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    shares: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    isShared: { type: Boolean, default: false },
    //   comments: [
    //     {
    //       user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    //       content: { type: String, required: true },
    //       createdAt: { type: Date, default: Date.now },
    //     },
    //   ],
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
postSchema.pre("save", function (next) {
  this.updatedAt = Utils.getTimeInUnixTimestamp();
  next();
});

const PostModel = mongoose.model("Post", postSchema);
exports.PostModel = PostModel;
