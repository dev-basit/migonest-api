const { db } = require("../startup/db");
const { userRepository } = require("./user-repositories");

const findById = async (id) => {
  try {
    return await db.conversations.findUnique({
      where: { id },
      include: {
        members: { select: { user: { select: userRepository.userBasicInfo } } },
        lastMessage: { select: { message: true, createdAt: true } },
      },
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

const findOne = async (params = {}) => {
  try {
    return await db.conversations.findFirst({
      where: params,
      include: {
        members: { select: { user: { select: userRepository.userBasicInfo } } },
        lastMessage: { select: { message: true, createdAt: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

const findAll = async (params = {}) => {
  try {
    const conversations = await db.conversations.findMany({
      where: params,
      include: {
        members: { select: { id: true, unreadCount: true, user: { select: userRepository.userBasicInfo } } },
        lastMessage: { select: { message: true, createdAt: true } },
      },
    });

    // sortiing by lastMessage within conversation
    return conversations.sort((a, b) => {
      const aTime = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt).getTime() : 0;
      const bTime = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt).getTime() : 0;
      return bTime - aTime;
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

const create = async (members) => {
  try {
    return await db.conversations.create({
      data: { members: { create: members.map((member) => ({ userId: member })) } },
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

const update = async (id, updatedData) => {
  try {
    return await db.conversations.update({ where: { id }, data: updatedData });
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.conversationRepository = {
  findById,
  findOne,
  findAll,
  create,
  update,
};
