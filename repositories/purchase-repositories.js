const { PurchaseModel } = require("../models");

const findPurchase = async (params = {}) => {
  try {
    return await PurchaseModel.findOne(params);
  } catch (error) {
    throw new Error(error.message);
  }
};

const findPurchaseById = async (id) => {
  try {
    return await PurchaseModel.findById(id);
  } catch (error) {
    throw new Error(error.message);
  }
};

const findPurchases = async (params = {}) => {
  try {
    return await PurchaseModel.find(params)
      // .populate("userId", "userName firstName lastName email profilePicture")
      .sort({ purchaseDate: -1 });
  } catch (error) {
    throw new Error(error.message);
  }
};

const createPurchase = async (purchaseData) => {
  try {
    const purchase = new PurchaseModel(purchaseData);
    return await purchase.save();
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.purchaseRepository = {
  findPurchase,
  findPurchaseById,
  findPurchases,
  createPurchase,
};
