const { MessageModel } = require("../models");

const findAll = async (params = {}) => {
  try {
    return await MessageModel.find(params).sort({ createdAt: 1 });
  } catch (error) {
    throw new Error(error.message);
  }
};

const create = async (data) => {
  try {
    const message = new MessageModel(data);
    return await message.save();
  } catch (error) {
    throw new Error(error.message);
  }
};

const update = async (id, updatedData) => {
  try {
    return await MessageModel.findByIdAndUpdate(id, updatedData, { new: true });
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.messageRepository = {
  findAll,
  create,
  update,
};
