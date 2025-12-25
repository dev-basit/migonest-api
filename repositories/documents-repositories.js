const { db } = require("../startup/db");

const findDocuments = async (params = {}) => {
  try {
    return await db.documents.findMany({
      where: params,
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

const findDocumentById = async (id) => {
  try {
    return await db.documents.findUnique({ where: { id } });
  } catch (error) {
    throw new Error(error.message);
  }
};

const createDocument = async (data) => {
  try {
    return await db.documents.create({ data });
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateDocument = async (id, updatedData) => {
  try {
    return await db.documents.update({ where: { id }, data: updatedData });
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteDocument = async (id) => {
  try {
    return await db.documents.delete({ where: { id } });
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.documentRepository = {
  findDocuments,
  findDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
};
