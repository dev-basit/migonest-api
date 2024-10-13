const { ResponseHandler, Constants } = require("../utils");

exports.adminMiddleware = function (req, res, next) {
  try {
    if (req.user.type !== Constants.SUPER_ADMIN)
      return ResponseHandler.sendForbiddenResponse(Constants.FORBIDDEN, res);

    next();
  } catch (error) {
    return ResponseHandler.sendBadResponse(error.message, res);
  }
};
