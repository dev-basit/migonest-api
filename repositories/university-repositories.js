const { UniversityModel } = require("../models");

const findUniversities = async (params = {}) => {
  try {
    return await UniversityModel.find(params)
      .populate("uniExpertId", "_id userName firstName lastName profilePicture type")
      .sort({ createdAt: -1 });
  } catch (error) {
    throw new Error(error.message);
  }
};

const findUniversityById = async (id) => {
  try {
    return await UniversityModel.findById(id);
  } catch (error) {
    throw new Error(error.message);
  }
};

const createUniversity = async (data) => {
  try {
    const university = new UniversityModel(data);
    return await university.save();
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateUniversity = async (id, updatedData, options = { new: true }) => {
  try {
    return await UniversityModel.findByIdAndUpdate(id, updatedData, options);
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.universityRepository = {
  findUniversities,
  findUniversityById,
  createUniversity,
  updateUniversity,
};
