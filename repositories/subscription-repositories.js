const { SubscriptionModel } = require("../models");

const findSubscription = async (params = {}) => {
  try {
    return await SubscriptionModel.findOne(params);
  } catch (error) {
    throw new Error(error.message);
  }
};

const findSubscriptionById = async (id) => {
  try {
    return await SubscriptionModel.findById(id);
  } catch (error) {
    throw new Error(error.message);
  }
};

const findSubscriptions = async (params = {}) => {
  try {
    return await SubscriptionModel.find(params);
  } catch (error) {
    throw new Error(error.message);
  }
};

const createSubscription = async (subscriptionData) => {
  try {
    const subscription = new SubscriptionModel(subscriptionData);
    return await subscription.save();
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateSubscription = async (filter, updatedData, options = { new: true }) => {
  try {
    return await SubscriptionModel.findOneAndUpdate(filter, updatedData, options);
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
