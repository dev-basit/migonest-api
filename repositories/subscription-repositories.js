const { db } = require("../startup/db");

const findSubscription = async (params = {}) => {
  try {
    return await db.subscriptions.findFirst({ where: params });
  } catch (error) {
    throw new Error(error.message);
  }
};

const findSubscriptionById = async (id) => {
  try {
    return await db.subscriptions.findUnique({ where: { id } });
  } catch (error) {
    throw new Error(error.message);
  }
};

const findSubscriptions = async (params = {}) => {
  try {
    return await db.subscriptions.findMany({ where: params });
  } catch (error) {
    throw new Error(error.message);
  }
};

const createSubscription = async (subscriptionData) => {
  try {
    return await db.subscriptions.create({ data: subscriptionData });
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateSubscription = async (filter, updatedData) => {
  try {
    // If filter contains id, use it directly; otherwise use findFirst to get the id
    if (filter.id) {
      return await db.subscriptions.update({ where: { id: filter.id }, data: updatedData });
    } else {
      const existing = await db.subscriptions.findFirst({ where: filter });
      if (!existing) throw new Error("Subscription not found");
      return await db.subscriptions.update({ where: { id: existing.id }, data: updatedData });
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.subscriptionRepository = {
  findSubscription,
  findSubscriptionById,
  findSubscriptions,
  createSubscription,
  updateSubscription,
};
