const express = require("express");
const { authControllers, usersControllers } = require("../controllers");
const { authMiddleware, errorMiddleware, logMiddleware } = require("../middleware");

exports.initRoutes = function (app) {
  app.use(express.json());
  app.use(authMiddleware); // Check if user send jwt token or not. It will also decode it to extract cosnumer details and it to req object, so all middlware below can access it via req.user
  app.use(logMiddleware);
  app.use("/v1/login", authControllers);
  app.use("/v1/users", usersControllers);
  app.use(errorMiddleware);
};
