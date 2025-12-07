const { db } = require("../startup/db");
const { userRepository } = require("./user-repositories");

const findAdmissions = async (params = {}) => {
  try {
    return await db.admissions.findMany({
      where: params,
      include: {
        uniExpertRequest: {
          include: {
            student: { select: userRepository.userBasicInfo },
            uniExpert: { select: userRepository.userBasicInfo },
            university: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

const findAdmissionById = async (id) => {
  try {
    return await db.admissions.findUnique({
      where: { id },
      include: {
        uniExpertRequest: {
          include: {
            student: { select: userRepository.userBasicInfo },
            uniExpert: { select: userRepository.userBasicInfo },
            university: true,
          },
        },
      },
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

const createAdmission = async (data) => {
  try {
    return await db.admissions.create({ data });
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateAdmission = async (id, updatedData) => {
  try {
    return await db.admissions.update({ where: { id }, data: updatedData });
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.admissionRepository = {
  findAdmissions,
  findAdmissionById,
  createAdmission,
  updateAdmission,
};
