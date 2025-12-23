const { db } = require("../startup/db");
const { userRepository } = require("./user-repositories");

const findUniExpertRequests = async (params = {}) => {
  try {
    return await db.uniExpertRequests.findMany({
      where: params,
      include: {
        student: { select: userRepository.userBasicInfo },
        uniExpert: { select: userRepository.userBasicInfo },
        university: true,
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

const findUniExpertRequestById = async (id) => {
  try {
    return await db.uniExpertRequests.findUnique({ where: { id } });
  } catch (error) {
    throw new Error(error.message);
  }
};

const createUniExpertRequest = async (data) => {
  try {
    return await db.uniExpertRequests.create({ data });
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateUniExpertRequest = async (id, updatedData) => {
  try {
    return await db.uniExpertRequests.update({ where: { id }, data: updatedData });
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
