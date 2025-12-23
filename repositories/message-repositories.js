const { db } = require("../startup/db");
const { userRepository } = require("./user-repositories");

const findAll = async (params = {}) => {
  try {
    return await db.messages.findMany({
      where: params,
      include: { sender: { select: userRepository.userBasicInfo } },
      orderBy: { createdAt: "asc" },
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

const create = async (data) => {
  try {
    return await db.messages.create({ data });
  } catch (error) {
    throw new Error(error.message);
  }
};

const update = async (id, updatedData) => {
  try {
    return await db.messages.update({ where: { id }, data: updatedData });
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.messageRepository = {
  findAll,
  create,
  update,
};
