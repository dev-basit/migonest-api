const { Logger } = require("../startup/logs");
const { Constants } = require("./constants");
const { Response } = require("./response");

class ResponseHandler {
  static sendOkResponse(data = null, msg = Constants.SUCCESS, res = null) {
    const response = new Response(data, Constants.HTTP_STATUS_CODES.OK, msg, Constants.SUCCESS);
    this.logSuccess(response);
    return res.status(Constants.HTTP_STATUS_CODES.OK).send(response);
  }

  static sendCreatedResponse(data = null, msg = Constants.SUCCESSFULLY_ADDED, res = null) {
    const response = new Response(data, Constants.HTTP_STATUS_CODES.CREATED, msg, Constants.SUCCESS);
    this.logSuccess(response);
    return res.status(Constants.HTTP_STATUS_CODES.CREATED).send(response);
  }

  static sendBadResponse(msg = Constants.BAD_REQUEST, res) {
    const response = new Response(null, Constants.HTTP_STATUS_CODES.BAD_REQUEST, msg, Constants.FAIL);
    this.logError(response);
    return res.status(Constants.HTTP_STATUS_CODES.BAD_REQUEST).send(response);
  }

  static sendUnauthorizedResponse(msg = Constants.UNAUTHORIZED, res) {
    const response = new Response(null, Constants.HTTP_STATUS_CODES.UNAUTHORIZED, msg, Constants.FAIL);
    this.logError(response);
    return res.status(Constants.HTTP_STATUS_CODES.UNAUTHORIZED).send(response);
  }

  static sendForbiddenResponse(msg = Constants.FORBIDDEN, res) {
    const response = new Response(null, Constants.HTTP_STATUS_CODES.FORBIDDEN, msg, Constants.FAIL);
    this.logError(response);
    return res.status(Constants.HTTP_STATUS_CODES.FORBIDDEN).send(response);
  }

  static sendConflictResponse(msg = Constants.CONFLICT, res) {
    const response = new Response(null, Constants.HTTP_STATUS_CODES.CONFLICT, msg, Constants.FAIL);
    this.logError(response);
    return res.status(Constants.HTTP_STATUS_CODES.CONFLICT).send(response);
  }

  static sendNotFoundResponse(msg = Constants.DATA_NOT_FOUND, res) {
    const response = new Response(null, Constants.HTTP_STATUS_CODES.NOT_FOUND, msg, Constants.FAIL);
    this.logError(response);
    return res.status(Constants.HTTP_STATUS_CODES.NOT_FOUND).send(response);
  }

  static sendInternalServerErrorResponse(msg = Constants.SERVER_ERROR, res) {
    const response = new Response(
      null,
      Constants.HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
      msg,
      Constants.FAIL
    );

    this.logError(response);
    return res.status(Constants.HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).send(response);
  }

  // logs used internally be response handlers
  static logSuccess(response) {
    Logger.info(response.getMessage());
    Logger.info(JSON.stringify(response));
  }

  static logError(response) {
    Logger.error(response.getMessage());
    Logger.error(JSON.stringify(response));
  }
}

exports.ResponseHandler = ResponseHandler;
