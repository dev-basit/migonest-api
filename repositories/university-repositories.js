const { db } = require("../startup/db");
const { userRepository } = require("./user-repositories");

const findUniversities = async (params = {}, { skip, pageSize }) => {
  try {
    const [universities, count] = await Promise.all([
      db.universities.findMany({
        where: params,
        include: {
          uniExpert: { select: userRepository.userBasicInfo },
          documents: { select: { id: true, label: true, url: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      db.universities.count({ where: params }),
    ]);
    return { universities, count };
  } catch (error) {
    throw new Error(error.message);
  }
};

const findUniversityById = async (id) => {
  try {
    return await db.universities.findUnique({
      where: { id },
      include: { uniExpert: { select: userRepository.userBasicInfo } },
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

const createUniversity = async (data) => {
  try {
    return await db.universities.create({ data });
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateUniversity = async (id, updatedData) => {
  try {
    return await db.universities.update({
      where: { id },
      data: updatedData,
    });
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
