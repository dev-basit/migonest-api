const { ResponseHandler, Constants } = require("../utils");
const { Logger } = require("../startup/logs");
const { checkoutService } = require("../services");
const { userRepository } = require("../repositories");

const createBillingPortalSession = async (req, res) => {
  try {
    Logger.info(Constants.FETCHING_DATA);

    const user = await userRepository.findUserById(req.user.id);
    if (!user || !user.stripeCustomerId) {
      return ResponseHandler.sendNotFoundResponse("User not found or no Stripe customer ID found", res);
    }

    if (user.type !== Constants.STUDENT)
      return ResponseHandler.sendBadResponse("Billing portal can be created for students only.", res);

    const session = await checkoutService.createBillingPortalSession(user.stripeCustomerId);

    return ResponseHandler.sendOkResponse({ url: session.url }, "Billing portal created successfully", res);
  } catch (error) {
    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

const createUniExpertServiceSession = async (req, res) => {
  try {
    const { uniExpertRequestId } = req.body;
    if (!uniExpertRequestId) {
      return ResponseHandler.sendBadResponse("Uni expert request id is required", res);
    }

    Logger.info(Constants.FETCHING_DATA);

    const user = await userRepository.findUserById(req.user.id);
    if (!user) {
      return ResponseHandler.sendNotFoundResponse(Constants.USER_NOT_FOUND, res);
    }

    const session = await checkoutService.createUniExpertServiceSession(user, uniExpertRequestId);

    return ResponseHandler.sendOkResponse(
      { checkoutUrl: session.url },
      "Checkout session created successfully",
      res
    );
  } catch (error) {
    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

const createSubscriptionSession = async (req, res) => {
  try {
    const { callbackPath } = req.body;

    const planDuration = "MONTH";
    if (!planDuration) {
      return ResponseHandler.sendBadResponse("Plan duration is required", res);
    }

    Logger.info(Constants.FETCHING_DATA);

    const user = await userRepository.findUserById(req.user.id);
    if (!user) {
      return ResponseHandler.sendNotFoundResponse("User not found", res);
    }

    const session = await checkoutService.createSubscriptionSession(user, planDuration, callbackPath);

    return ResponseHandler.sendOkResponse(
      { checkoutUrl: session.url },
      "Subscription checkout session created successfully",
      res
    );
  } catch (error) {
    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

exports.checkoutControllers = {
  createBillingPortalSession,
  createUniExpertServiceSession,
  createSubscriptionSession,
};
