const { UniExpertRequestModel } = require("../models");

const findUniExpertRequests = async (params = {}) => {
  try {
    return await UniExpertRequestModel.find(params)
      .populate("studentId", "userName firstName lastName profilePicture preferences following")
      .populate("universityId")
      .sort({ createdAt: -1 });
  } catch (error) {
    throw new Error(error.message);
  }
};

const findUniExpertRequestById = async (id) => {
  try {
    return await UniExpertRequestModel.findById(id);
  } catch (error) {
    throw new Error(error.message);
  }
};

const createUniExpertRequest = async (data) => {
  try {
    const request = new UniExpertRequestModel(data);
    return await request.save();
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.uniExpertRequestRepository = {
  findUniExpertRequests,
  findUniExpertRequestById,
  createUniExpertRequest,
};
