const { ExperienceModel, EducationModel, IeltsModel } = require("../models");

const findExperienceById = async (id) => {
  try {
    return await ExperienceModel.findById(id);
  } catch (error) {
    throw new Error(error.message);
  }
};

const findEducationById = async (id) => {
  try {
    return await EducationModel.findById(id);
  } catch (error) {
    throw new Error(error.message);
  }
};

const findIeltsById = async (id) => {
  try {
    return await IeltsModel.findById(id);
  } catch (error) {
    throw new Error(error.message);
  }
};

const createExperience = async (data) => {
  try {
    const experience = new ExperienceModel(data);
    return await experience.save();
  } catch (error) {
    throw new Error(error.message);
  }
};

const createEducation = async (data) => {
  try {
    const education = new EducationModel(data);
    return await education.save();
  } catch (error) {
    throw new Error(error.message);
  }
};

const createIelts = async (data) => {
  try {
    const ielts = new IeltsModel(data);
    return await ielts.save();
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateExperience = async (id, updatedData, options = { new: true }) => {
  try {
    return await ExperienceModel.findByIdAndUpdate(id, updatedData, options);
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateEducation = async (id, updatedData, options = { new: true }) => {
  try {
    return await EducationModel.findByIdAndUpdate(id, updatedData, options);
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateIelts = async (id, updatedData, options = { new: true }) => {
  try {
    return await IeltsModel.findByIdAndUpdate(id, updatedData, options);
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.userProfileRepository = {
  findExperienceById,
  findEducationById,
  findIeltsById,
  createExperience,
  updateExperience,
  createIelts,
  updateEducation,
  createEducation,
  updateIelts,
};
