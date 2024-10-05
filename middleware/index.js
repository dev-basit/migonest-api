const { authMiddleware } = require("./auth");
const { adminMiddleware } = require("./admin");
const { errorMiddleware } = require("./error");
const { logMiddleware } = require("./logger");

module.exports = {
  authMiddleware,
  adminMiddleware,
  errorMiddleware,
  logMiddleware,
};
