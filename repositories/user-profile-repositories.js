const { db } = require("../startup/db");

const findExperienceById = async (id) => {
  try {
    return await db.experiences.findUnique({ where: { id } });
  } catch (error) {
    throw new Error(error.message);
  }
};

const findEducationById = async (id) => {
  try {
    return await db.education.findUnique({ where: { id } });
  } catch (error) {
    throw new Error(error.message);
  }
};

const findIeltsById = async (id) => {
  try {
    return await db.ielts.findUnique({ where: { id } });
  } catch (error) {
    throw new Error(error.message);
  }
};

const createExperience = async (data) => {
  try {
    return await db.experiences.create({ data });
  } catch (error) {
    throw new Error(error.message);
  }
};

const createEducation = async (data) => {
  try {
    return await db.education.create({ data });
  } catch (error) {
    throw new Error(error.message);
  }
};

const createIelts = async (data) => {
  try {
    return await db.ielts.create({ data });
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateExperience = async (id, updatedData) => {
  try {
    return await db.experiences.update({ where: { id }, data: updatedData });
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateEducation = async (id, updatedData) => {
  try {
    return await db.education.update({ where: { id }, data: updatedData });
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateIelts = async (id, updatedData) => {
  try {
    return await db.ielts.update({ where: { id }, data: updatedData });
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
