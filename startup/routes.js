const express = require("express");
const {
  authRoutes,
  usersRoutes,
  usersProfileRoutes,
  postsRoutes,
  universitiesRoutes,
  uniExpertRequestRoutes,
  admissionRoutes,
  becomeUniExpertRoutes,
  contactUsRoutes,
  uploadRoutes,
  conversationRoutes,
  messageRoutes,
  notificationRoutes,
} = require("../routes");
const { authMiddleware, errorMiddleware, logMiddleware } = require("../middleware");

exports.initRoutes = function (app) {
  app.use(express.json());
  app.use(authMiddleware); // Check if user send jwt token or not. It will also decode it to extract cosnumer details and it to req object, so all middlware below can access it via req.user
  app.use(logMiddleware);
  app.use("/v1/auth", authRoutes);
  app.use("/v1/users", usersRoutes);
  app.use("/v1/users/profile", usersProfileRoutes);
  app.use("/v1/posts", postsRoutes);
  app.use("/v1/universities", universitiesRoutes);
  app.use("/v1/uni/expert/requests", uniExpertRequestRoutes);
  app.use("/v1/admissions", admissionRoutes);
  app.use("/v1/become/uni/experts", becomeUniExpertRoutes);
  app.use("/v1/contact/us", contactUsRoutes);
  app.use("/v1/upload", uploadRoutes);
  app.use("/v1/conversations", conversationRoutes);
  app.use("/v1/messages", messageRoutes);
  app.use("/v1/notifications", notificationRoutes);
  app.use(errorMiddleware);
};
