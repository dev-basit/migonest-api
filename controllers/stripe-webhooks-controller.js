const { ResponseHandler, stripe } = require("../utils");
const { config } = require("../config");
const { Logger } = require("../startup/logs");
const { subscriptionService, purchaseService } = require("../services");

const webhook = async (req, res) => {
  const body = req.body;
  const signature = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, config.stripeWebhookSecret);
  } catch (err) {
    Logger.error(`Webhook signature verification failed: ${err.message}`);
    return ResponseHandler.sendBadResponse("Webhook signature verification failed", res);
  }

  try {
    Logger.info(`Processing webhook event: ${event.type}`);

    switch (event.type) {
      case "checkout.session.completed":
        await purchaseService.purchaseUniExpertRequest(event.data.object);
        break;
      case "customer.subscription.created":
        await subscriptionService.subscriptionCreated(event.data.object);
        break;
      case "customer.subscription.updated":
        await subscriptionService.subscriptionUpdated(event.data.object);
        break;
      case "customer.subscription.deleted":
        await subscriptionService.subscriptionDeleted(event.data.object);
        break;
      default:
        Logger.info(`Unhandled event type: ${event.type}`);
        break;
    }

    return ResponseHandler.sendOkResponse(null, "Webhook processed successfully", res);
  } catch (error) {
    Logger.error(`Error processing webhook (${event.type}): ${error.message}`);
    return ResponseHandler.sendInternalServerErrorResponse("Error processing webhook", res);
  }
};

exports.stripeWebhooksControllers = {
  webhook,
};
