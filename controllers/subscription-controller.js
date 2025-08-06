const { ResponseHandler, Constants } = require("../utils");
const { Logger } = require("../startup/logs");
const { subscriptionService } = require("../services");

const subscriptionFind = async (req, res) => {
  try {
    Logger.info(Constants.FETCHING_DATA);
    const subscription = await subscriptionService.getSubscription(req.user._id);
    return ResponseHandler.sendOkResponse(subscription, Constants.SUCCESSFULLY_FETCED, res);
  } catch (error) {
    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

exports.subscriptionControllers = {
  subscriptionFind,
};
