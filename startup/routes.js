const express = require("express");
const { authRoutes, usersRoutes, usersProfileRoutes, postsRoutes } = require("../routes");
const { authMiddleware, errorMiddleware, logMiddleware } = require("../middleware");

exports.initRoutes = function (app) {
  app.use(express.json());
  app.use(authMiddleware); // Check if user send jwt token or not. It will also decode it to extract cosnumer details and it to req object, so all middlware below can access it via req.user
  app.use(logMiddleware);
  app.use("/v1/auth", authRoutes);
  app.use("/v1/users", usersRoutes);
  app.use("/v1/users/profile", usersProfileRoutes);
  app.use("/v1/posts", postsRoutes);
  app.use(errorMiddleware);
};
