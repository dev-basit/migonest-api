const { db } = require("../startup/db");
const { userRepository } = require("./user-repositories");

const userBasicInfoWithDocuments = {
  id: true,
  userName: true,
  firstName: true,
  lastName: true,
  email: true,
  profilePicture: true,
  type: true,
  preferences: true,
  stripeCustomerId: true,
  documents: true,
};

const findAdmissions = async (params = {}) => {
  try {
    return await db.admissions.findMany({
      where: params,
      include: {
        documents: true,
        uniExpertRequest: {
          include: {
            student: { select: userBasicInfoWithDocuments },
            uniExpert: { select: userRepository.userBasicInfo },
            university: { include: { documents: true } },
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
