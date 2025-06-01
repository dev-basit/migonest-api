const { ResponseHandler, Constants } = require("../utils");
const { Logger } = require("../startup/logs");
const { notificationRepository, userRepository } = require("../repositories");
const { notificationService } = require("../services");

const notificationsFind = async (req, res) => {
  try {
    const filters = { user: req.user._id };

    Logger.info(Constants.FETCHING_DATA);

    const notifications = await notificationRepository.findAll(filters);
    return ResponseHandler.sendOkResponse(notifications, Constants.SUCCESSFULLY_FETCED, res);
  } catch (error) {
    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

const notificationCreate = async (req, res) => {
  try {
    const payload = req.body;
    const { error } = notificationService.validateNotification(payload);
    if (error) return ResponseHandler.sendBadResponse(error.details[0].message, res);

    const user = await userRepository.findUserById(payload.user);
    if (!user) return ResponseHandler.sendNotFoundResponse(Constants.USER_NOT_FOUND, res);

    Logger.info(Constants.PAYLOAD_IS_CORRECT);

    const createdNotification = await notificationRepository.create(payload);
    return ResponseHandler.sendCreatedResponse(createdNotification, Constants.SUCCESSFULLY_ADDED, res);
  } catch (error) {
    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

const notificationUpdate = async (req, res) => {
  try {
    let notificationId = req.params.id;
    if (!notificationId) return ResponseHandler.sendBadResponse(Constants.SEND_ID_IN_PARAMS, res);

    const payload = {};
    if (req.body.isRead) payload.isRead = req.body.isRead;
    const updatedNotification = await notificationRepository.update(notificationId, payload);
    return ResponseHandler.sendOkResponse(updatedNotification, Constants.SUCCESSFULLY_UPDATED_, res);
  } catch (error) {
    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

exports.notificationControllers = {
  notificationsFind,
  notificationCreate,
  notificationUpdate,
};
