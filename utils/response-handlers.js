const { Logger } = require("../startup/logs");
const { Constants } = require("./constants");
const { Response } = require("./response");

class ResponseHandler {
  static sendOkRequest(data = null, msg = Constants.SUCCESS, res = null) {
    const response = new Response(data, Constants.HTTP_STATUS_CODES.OK, msg, Constants.SUCCESS);
    this.logSuccess(response);
    return res.status(Constants.HTTP_STATUS_CODES.OK).send(response);
  }

  static sendCreatedRequest(data = null, msg = "Successfuly created new resource.", res = null) {
    const response = new Response(data, Constants.HTTP_STATUS_CODES.CREATED, msg, Constants.SUCCESS);
    this.logSuccess(response);
    return res.status(Constants.HTTP_STATUS_CODES.CREATED).send(response);
  }

  static sendBadRequest(msg = "Bad request. Your request cannot be fulfilled.", res) {
    const response = new Response(null, Constants.HTTP_STATUS_CODES.BAD_REQUEST, msg, Constants.FAIL);
    this.logError(response);
    return res.status(Constants.HTTP_STATUS_CODES.BAD_REQUEST).send(response);
  }

  static sendUnauthorizedRequest(msg = "you are unauthorized to access this data.", res) {
    const response = new Response(null, Constants.HTTP_STATUS_CODES.UNAUTHORIZED, msg, Constants.FAIL);
    this.logError(response);
    return res.status(Constants.HTTP_STATUS_CODES.UNAUTHORIZED).send(response);
  }

  static sendForbiddenRequest(msg = "You are not allowed to access this data.", res) {
    const response = new Response(null, Constants.HTTP_STATUS_CODES.FORBIDDEN, msg, Constants.FAIL);
    this.logError(response);
    return res.status(Constants.HTTP_STATUS_CODES.FORBIDDEN).send(response);
  }

  static sendNotFoundRequest(msg = "Requested data does not exist.", res) {
    const response = new Response(null, Constants.HTTP_STATUS_CODES.NOT_FOUND, msg, Constants.FAIL);
    this.logError(response);
    return res.status(Constants.HTTP_STATUS_CODES.NOT_FOUND).send(response);
  }

  static sendInternalServerErrorRequest(msg = "Internal server error occured.", res) {
    const response = new Response(
      null,
      Constants.HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
      msg,
      Constants.FAIL
    );

    this.logError(response);
    return res.status(Constants.HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).send(response);
  }

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
