const { ConversationModel } = require("../models");

const findById = async (id) => {
  try {
    return await ConversationModel.findById(id)
      .populate("members", "firstName lastName profilePicture type")
      .populate("lastMessage", "message createdAt");
  } catch (error) {
    throw new Error(error.message);
  }
};

const findOne = async (params = {}) => {
  try {
    return await ConversationModel.findOne(params)
      .populate("members", "firstName lastName profilePicture type")
      .populate("lastMessage", "message createdAt")
      .sort({ createdAt: -1 });
  } catch (error) {
    throw new Error(error.message);
  }
};

const findAll = async (params = {}) => {
  try {
    const conversations = await ConversationModel.find(params)
      .populate("members", "firstName lastName profilePicture type")
      .populate("lastMessage", "message createdAt")
      .lean();

    // sortiing by lastMessage within conversation
    return conversations.sort((a, b) => {
      const aTime = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt).getTime() : 0;
      const bTime = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt).getTime() : 0;
      return bTime - aTime;
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

const create = async (data) => {
  try {
    const conversation = new ConversationModel(data);
    return await conversation.save();
  } catch (error) {
    throw new Error(error.message);
  }
};

const update = async (id, updatedData) => {
  try {
    return await ConversationModel.findByIdAndUpdate(id, updatedData, { new: true });
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.conversationRepository = {
  findById,
  findOne,
  findAll,
  create,
  update,
};
