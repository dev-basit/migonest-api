const { authMiddleware } = require("./auth");
const { adminMiddleware } = require("./admin");
const { errorMiddleware } = require("./error");
const { logMiddleware } = require("./logger");
const { paginationMiddleware } = require("./pagination");

module.exports = { authMiddleware, adminMiddleware, errorMiddleware, logMiddleware, paginationMiddleware };
