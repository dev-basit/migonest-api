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
    return await db.subscriptions.update({ where: filter, data: updatedData });
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
