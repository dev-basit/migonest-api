const { NotificationModel } = require("../models");

const findAll = async (params = {}) => {
  try {
    return await NotificationModel.find(params).sort({ createdAt: -1 });
  } catch (error) {
    throw new Error(error.message);
  }
};

const create = async (data) => {
  try {
    const notification = new NotificationModel(data);
    return await notification.save();
  } catch (error) {
    throw new Error(error.message);
  }
};

const update = async (id, updatedData) => {
  try {
    return await NotificationModel.findByIdAndUpdate(id, updatedData, { new: true });
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.notificationRepository = {
  findAll,
  create,
  update,
};
