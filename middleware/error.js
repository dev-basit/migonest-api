require("express-async-errors");
// By default if you do not use this package, only synchronous exceptions (without try-catch block) that occur during express req-res cycle will be caught or handled by this error middleware
// synchronous exceptions with try-catch bloack will not be covered by this. They are handled locally in catch block
// This by default doesnt cover asynchronous exceptions or rejections without try-catch
// To cover asynchronous exceptions or rejections, use the aboive package

const { ResponseHandler } = require("../utils");
const { Logger } = require("../startup/logs");

exports.errorMiddleware = function (err, req, res, next) {
  Logger.error(err.message);
  return ResponseHandler.sendInternalServerErrorResponse(err.message, res);
};
