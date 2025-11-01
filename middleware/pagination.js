const { ResponseHandler } = require("../utils");

exports.paginationMiddleware = function (req, res, next) {
  try {
    const pageNo = parseInt(req.query.pageNo || 1);
    const pageSize = parseInt(req.query.pageSize || 10);
    const skip = (pageNo - 1) * pageSize;

    req.pagination = { pageNo, pageSize, skip };

    next();
  } catch (error) {
    return ResponseHandler.sendBadResponse(error.message, res);
  }
};
