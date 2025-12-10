const { db } = require("../startup/db");
const { userRepository } = require("./user-repositories");

const findById = async (id) => {
  try {
    return await db.conversationMembers.findUnique({
      where: { id },
      include: { user: { select: userRepository.userBasicInfo }, conversation: true },
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

const findOne = async (params = {}) => {
  try {
    return await db.conversationMembers.findFirst({
      where: params,
      include: { user: { select: userRepository.userBasicInfo }, conversation: true },
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

const findUnique = async (params = {}) => {
  try {
    return await db.conversationMembers.findUnique({
      where: params,
      include: { user: { select: userRepository.userBasicInfo }, conversation: true },
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

const findAll = async (params = {}) => {
  try {
    return await db.conversationMembers.findMany({
      where: params,
      include: { user: { select: userRepository.userBasicInfo }, conversation: true },
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

const create = async (data) => {
  try {
    return await db.conversationMembers.create({ data });
  } catch (error) {
    throw new Error(error.message);
  }
};

const update = async (id, updatedData) => {
  try {
    return await db.conversationMembers.update({ where: { id }, data: updatedData });
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteById = async (id) => {
  try {
    return await db.conversationMembers.delete({ where: { id } });
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.conversationMembersRepository = {
  findById,
  findOne,
  findUnique,
  findAll,
  create,
  update,
  deleteById,
};
