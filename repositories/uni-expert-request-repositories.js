const { UniExpertRequestModel } = require("../models");
const { db } = require("../startup/db");

const findUniExpertRequests = async (params = {}) => {
  try {
    return await db.uniExpertRequests.findMany({
      where: params,
      // include: { studentId: true, uniExpertId: true, universityId: true },
      orderBy: { createdAt: "desc" },
    });
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

const updateUniExpertRequest = async (id, updatedData, options = { new: true }) => {
  try {
    return await UniExpertRequestModel.findByIdAndUpdate(id, updatedData, options);
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.uniExpertRequestRepository = {
  findUniExpertRequests,
  findUniExpertRequestById,
  createUniExpertRequest,
  updateUniExpertRequest,
};
