const { db } = require("../startup/db");
const { userRepository } = require("./user-repositories");

const findBecomeUniExperts = async (params = {}) => {
  try {
    return await db.becomeUniExperts.findMany({
      where: params,
      include: { student: { select: userRepository.userBasicInfo } },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

const findBecomeUniExpertsById = async (id) => {
  try {
    return await db.becomeUniExperts.findUnique({
      where: { id },
      include: { student: { select: userRepository.userBasicInfo } },
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

const createBecomeUniExperts = async (data) => {
  try {
    return await db.becomeUniExperts.create({ data });
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateBecomeUniExperts = async (id, updatedData) => {
  try {
    return await db.becomeUniExperts.update({ where: { id }, data: updatedData });
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
