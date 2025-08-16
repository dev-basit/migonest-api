const { userRepository, subscriptionRepository, purchaseRepository } = require("../repositories");
const { sendEmail } = require("../utils");
const { config } = require("../config");
const { Logger } = require("../startup/logs");

const getSubscription = async (userId) => {
  // const user = await userRepository.findUserById(userId);
  // if (!user?.currentSubscriptionId) return null;

  return subscriptionRepository.findSubscription({ userId });
};

const subscriptionCreated = async (subscription) => {
  const user = await userRepository.findUser({ stripeCustomerId: subscription.customer });
  if (!user) throw new Error(`User not found for stripe customer id: ${subscription.customer}`);

  const item = subscription.items.data[0];
  const currentPeriodStart = item.current_period_start;
  const currentPeriodEnd = item.current_period_end;
  const plan = item.plan.id === config.stripeMonthlyPriceId ? "month" : "year";

  const subscriptionData = {
    userId: user._id.toString(),
    planType: plan,
    stripeSubscriptionId: subscription.id,
    status: subscription.status,
    currentPeriodStart: new Date(currentPeriodStart * 1000),
    currentPeriodEnd: new Date(currentPeriodEnd * 1000),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
  };

  const newSubscription = await subscriptionRepository.createSubscription(subscriptionData);

  await userRepository.updateUser(user._id, { currentSubscriptionId: newSubscription._id });

  Logger.info(`Payment received for user ${user._id.toString()} with plan ${plan}`);

  await purchaseRepository.createPurchase({
    userId: user._id.toString(),
    subscriptionId: newSubscription._id,
    type: "subscription",
    amount: subscription.items.data[0].plan.amount / 100,
    stripePurchaseId: subscription.id,
  });

  Logger.info(`Subscription purchase created for user ${user._id.toString()} with plan ${plan}`);

  if (subscription.status === "active") {
    await sendEmail({
      receiver: user.email,
      subject: "Subscription Activated",
      text: `Your Migonest subscription has been activated.`,
    });
  }
};

const subscriptionUpdated = async (subscription) => {
  const user = await userRepository.findUser({ stripeCustomerId: subscription.customer });
  if (!user) throw new Error(`User not found for stripe customer id: ${subscription.customer}`);

  const item = subscription.items.data[0];
  const currentPeriodStart = item.current_period_start;
  const currentPeriodEnd = item.current_period_end;
  const plan = item.plan.id === config.stripeMonthlyPriceId ? "month" : "year";

  const isSubscriptionCancelled = subscription.cancellation_details.reason === "cancellation_requested";
  if (isSubscriptionCancelled) {
    const subscriptionData = {
      userId: user._id.toString(),
      planType: plan,
      stripeSubscriptionId: subscription.id,
      status: "cancelled",
      currentPeriodStart: new Date(currentPeriodStart * 1000),
      currentPeriodEnd: new Date(currentPeriodEnd * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    };

    const updatedSubscription = await subscriptionRepository.updateSubscription(
      { stripeSubscriptionId: subscription.id },
      subscriptionData,
      { new: true, upsert: true }
    );

    await userRepository.updateUser(user._id, { currentSubscriptionId: updatedSubscription._id });

    await sendEmail({
      receiver: user.email,
      subject: "Subscription Deactivated",
      text: `Your Migonest subscription has been deactivated. You can use pro service till the end of the current subscription period.`,
    });
  }
};

const subscriptionDeleted = async (subscription) => {
  const user = await userRepository.findUser({ stripeCustomerId: subscription.customer });
  if (!user) throw new Error(`User not found for stripe customer id: ${subscription.customer}`);

  await subscriptionRepository.updateSubscription(subscription.id, { status: "canceled" });

  await userRepository.updateUser(user._id, { $unset: { currentSubscriptionId: 1 } });

  await sendEmail({
    receiver: user.email,
    subject: "Subscription Deactivated",
    text: `Your Migonest subscription has been deactivated. You can use pro service till the end of the current subscription period.`,
  });
};

exports.subscriptionService = {
  getSubscription,
  subscriptionCreated,
  subscriptionUpdated,
  subscriptionDeleted,
};
