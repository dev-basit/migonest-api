const { BecomeUniExpertModel } = require("../models");

const findBecomeUniExperts = async (params = {}) => {
  try {
    return await BecomeUniExpertModel.find(params)
      .populate("studentId", "userName firstName lastName profilePicture preferences following")
      .sort({ createdAt: -1 });
  } catch (error) {
    throw new Error(error.message);
  }
};

const findBecomeUniExpertsById = async (id) => {
  try {
    return await BecomeUniExpertModel.findById(id);
  } catch (error) {
    throw new Error(error.message);
  }
};

const createBecomeUniExperts = async (data) => {
  try {
    const request = new BecomeUniExpertModel(data);
    return await request.save();
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateBecomeUniExperts = async (id, updatedData, options = { new: true }) => {
  try {
    return await BecomeUniExpertModel.findByIdAndUpdate(id, updatedData, options);
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.becomeUniExpertsRepository = {
  findBecomeUniExperts,
  findBecomeUniExpertsById,
  createBecomeUniExperts,
  updateBecomeUniExperts,
};
