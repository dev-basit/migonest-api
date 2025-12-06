const { userRepository, subscriptionRepository, purchaseRepository } = require("../repositories");
const { sendEmail, html } = require("../utils");
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
  const plan = item.plan.id === config.stripeMonthlyPriceId ? "MONTH" : "YEAR";

  const subscriptionData = {
    userId: user.id.toString(),
    planType: plan,
    stripeSubscriptionId: subscription.id,
    status: subscription.status,
    currentPeriodStart: new Date(currentPeriodStart * 1000),
    currentPeriodEnd: new Date(currentPeriodEnd * 1000),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
  };

  const newSubscription = await subscriptionRepository.createSubscription(subscriptionData);

  await userRepository.updateUser(user.id, { currentSubscriptionId: newSubscription.id });

  Logger.info(`Payment received for user ${user.id.toString()} with plan ${plan}`);

  await purchaseRepository.createPurchase({
    userId: user.id.toString(),
    subscriptionId: newSubscription.id,
    type: "SUBSCRIPTION",
    amount: subscription.items.data[0].plan.amount / 100,
    stripePurchaseId: subscription.id,
  });

  Logger.info(`Subscription purchase created for user ${user.id.toString()} with plan ${plan}`);

  if (subscription.status === "active") {
    await sendEmail({
      receiver: user.email,
      subject: "Subscription Activated",
      text: html.subscriptionActivated({
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        plan,
        periodStart: new Date(currentPeriodStart * 1000).toDateString(),
        periodEnd: new Date(currentPeriodEnd * 1000).toDateString(),
      }),
    });
  }
};

const subscriptionUpdated = async (subscription) => {
  const user = await userRepository.findUser({ stripeCustomerId: subscription.customer });
  if (!user) throw new Error(`User not found for stripe customer id: ${subscription.customer}`);

  const item = subscription.items.data[0];
  const currentPeriodStart = item.current_period_start;
  const currentPeriodEnd = item.current_period_end;
  const plan = item.plan.id === config.stripeMonthlyPriceId ? "MONTH" : "YEAR";

  const isSubscriptionCancelled = subscription.cancellation_details.reason === "cancellation_requested";

  const subscriptionData = {
    userId: user.id.toString(),
    planType: plan,
    stripeSubscriptionId: subscription.id,
    status: isSubscriptionCancelled ? "cancelled" : "active",
    currentPeriodStart: new Date(currentPeriodStart * 1000),
    currentPeriodEnd: new Date(currentPeriodEnd * 1000),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
  };

  const updatedSubscription = await subscriptionRepository.updateSubscription(
    { stripeSubscriptionId: subscription.id },
    subscriptionData,
    { new: true, upsert: true }
  );

  await userRepository.updateUser(user.id, { currentSubscriptionId: updatedSubscription.id });

  if (isSubscriptionCancelled) {
    await sendEmail({
      receiver: user.email,
      subject: "Subscription Deactivated",
      text: html.subscriptionDeactivated({
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        periodEnd: new Date(currentPeriodEnd * 1000).toDateString(),
      }),
    });
  } else {
    await sendEmail({
      receiver: user.email,
      subject: "Subscription Activated Again",
      text: html.subscriptionActivated({
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        plan,
        periodStart: new Date(currentPeriodStart * 1000).toDateString(),
        periodEnd: new Date(currentPeriodEnd * 1000).toDateString(),
      }),
    });
  }
};

const subscriptionDeleted = async (subscription) => {
  const user = await userRepository.findUser({ stripeCustomerId: subscription.customer });
  if (!user) throw new Error(`User not found for stripe customer id: ${subscription.customer}`);

  await subscriptionRepository.updateSubscription(
    { stripeSubscriptionId: subscription.id },
    { status: "deleted" }
  );

  await userRepository.updateUser(user.id, { $unset: { currentSubscriptionId: 1 } });

  await sendEmail({
    receiver: user.email,
    subject: "Subscription Deactivated",
    text: html.subscriptionDeactivated({
      name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      periodEnd: new Date(subscription.current_period_end * 1000).toDateString(),
    }),
  });
};

exports.subscriptionService = {
  getSubscription,
  subscriptionCreated,
  subscriptionUpdated,
  subscriptionDeleted,
};
