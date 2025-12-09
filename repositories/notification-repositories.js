const { db } = require("../startup/db");

const findAll = async (params = {}) => {
  try {
    return await db.notifications.findMany({
      where: params,
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

const create = async (data) => {
  try {
    return await db.notifications.create({ data });
  } catch (error) {
    throw new Error(error.message);
  }
};

const update = async (id, updatedData) => {
  try {
    return await db.notifications.update({ where: { id }, data: updatedData });
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.notificationRepository = {
  findAll,
  create,
  update,
};
