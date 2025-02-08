const { AdmissionModel } = require("../models");

const findAdmissions = async (params = {}) => {
  try {
    return await AdmissionModel.find(params)
      .populate({
        path: "uniExpertRequestId",
        populate: [
          { path: "studentId", select: "_id userName profilePicture" },
          { path: "uniExpertId", select: "_id userName profilePicture" },
          { path: "universityId" },
        ],
      })
      .sort({ createdAt: -1 });
  } catch (error) {
    throw new Error(error.message);
  }
};

const findAdmissionById = async (id) => {
  try {
    return await AdmissionModel.findById(id);
  } catch (error) {
    throw new Error(error.message);
  }
};

const createAdmission = async (data) => {
  try {
    const admission = new AdmissionModel(data);
    return await admission.save();
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.admissionRepository = {
  findAdmissions,
  findAdmissionById,
  createAdmission,
};
