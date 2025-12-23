const { db } = require("../startup/db");
const { userRepository } = require("./user-repositories");

const findPurchase = async (params = {}) => {
  try {
    return await db.purchases.findFirst({
      where: params,
      include: {
        user: { select: userRepository.userBasicInfo },
        uniExpertRequest: {
          include: {
            student: { select: userRepository.userBasicInfo },
            uniExpert: { select: userRepository.userBasicInfo },
            // university: true,
          },
        },
      },
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

const findPurchaseById = async (id) => {
  try {
    return await db.purchases.findUnique({
      where: { id },
      include: {
        user: { select: userRepository.userBasicInfo },
        uniExpertRequest: {
          include: {
            student: { select: userRepository.userBasicInfo },
            uniExpert: { select: userRepository.userBasicInfo },
            // university: true,
          },
        },
      },
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

const findPurchases = async (params = {}) => {
  try {
    return await db.purchases.findMany({
      where: params,
      include: {
        user: { select: userRepository.userBasicInfo },
        uniExpertRequest: {
          include: {
            student: { select: userRepository.userBasicInfo },
            uniExpert: { select: userRepository.userBasicInfo },
            // university: true,
          },
        },
      },
      orderBy: { purchaseDate: "desc" },
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

const findPurchasesAll = async (query) => {
  try {
    const { uniExpertId, studentId } = query;

    if (studentId) {
      return await db.purchases.findMany({
        where: { userId: studentId },
        include: {
          user: { select: userRepository.userBasicInfo },
          uniExpertRequest: {
            include: {
              uniExpert: { select: userRepository.userBasicInfo },
              student: { select: userRepository.userBasicInfo },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    }

    if (uniExpertId) {
      return await db.purchases.findMany({
        where: {
          type: "UNI_EXPERT_REQUEST",
          uniExpertRequestId: { not: null },
          uniExpertRequest: {
            uniExpertId: uniExpertId,
          },
        },
        include: {
          user: { select: userRepository.userBasicInfo },
          uniExpertRequest: {
            include: {
              uniExpert: { select: userRepository.userBasicInfo },
              student: { select: userRepository.userBasicInfo },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    }

    return await db.purchases.findMany({
      include: {
        user: { select: userRepository.userBasicInfo },
        uniExpertRequest: {
          include: {
            uniExpert: { select: userRepository.userBasicInfo },
            student: { select: userRepository.userBasicInfo },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

const createPurchase = async (purchaseData) => {
  try {
    return await db.purchases.create({ data: purchaseData });
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.purchaseRepository = {
  findPurchase,
  findPurchaseById,
  findPurchases,
  findPurchasesAll,
  createPurchase,
};
