const { mongoose } = require("mongoose");
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
      .populate("userId", "userName firstName lastName  profilePicture preferences")
      .populate({
        path: "uniExpertRequestId",
        populate: [
          { path: "studentId", select: "_id userName profilePicture" },
          { path: "uniExpertId", select: "_id userName profilePicture" },
          { path: "universityId" },
        ],
      })
      .sort({ purchaseDate: -1 });
  } catch (error) {
    throw new Error(error.message);
  }
};

async function findPurchasesAll(query) {
  const { uniExpertId, studentId } = query;

  if (studentId) {
    return PurchaseModel.find({ userId: studentId })
      .populate({
        path: "userId",
        select: "userName email profilePicture preferences",
      })
      .populate({
        path: "uniExpertRequestId",
        populate: [
          { path: "uniExpertId", select: "userName email profilePicture preferences" },
          { path: "studentId", select: "userName email profilePicture preferences" },
        ],
      })
      .sort({ createdAt: -1 });
  }

  if (uniExpertId) {
    const objectId = new mongoose.Types.ObjectId(uniExpertId);

    const results = await PurchaseModel.aggregate([
      {
        $match: {
          type: "uniExpertRequest",
          uniExpertRequestId: { $exists: true, $ne: null },
        },
      },

      // Lookup uniExpertRequestId
      {
        $lookup: {
          from: "uniexpertrequests",
          localField: "uniExpertRequestId",
          foreignField: "_id",
          as: "uniExpertRequest",
        },
      },
      { $unwind: "$uniExpertRequest" },

      // Match by uniExpertId
      {
        $match: {
          "uniExpertRequest.uniExpertId": objectId,
        },
      },

      // Lookup uniExpertId (user)
      {
        $lookup: {
          from: "users",
          let: { id: "$uniExpertRequest.uniExpertId" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$id"] } } },
            {
              $project: {
                _id: 1,
                userName: 1,
                email: 1,
                profilePicture: 1,
                preferences: 1,
              },
            },
          ],
          as: "uniExpertRequest.uniExpertId",
        },
      },
      { $unwind: "$uniExpertRequest.uniExpertId" },

      // Lookup studentId (user)
      {
        $lookup: {
          from: "users",
          let: { id: "$uniExpertRequest.studentId" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$id"] } } },
            {
              $project: {
                _id: 1,
                userName: 1,
                email: 1,
                profilePicture: 1,
                preferences: 1,
              },
            },
          ],
          as: "uniExpertRequest.studentId",
        },
      },
      { $unwind: "$uniExpertRequest.studentId" },

      // Lookup purchaser userId
      {
        $lookup: {
          from: "users",
          let: { id: "$userId" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$id"] } } },
            {
              $project: {
                _id: 1,
                userName: 1,
                email: 1,
                profilePicture: 1,
                preferences: 1,
              },
            },
          ],
          as: "user",
        },
      },
      { $unwind: "$user" },

      // Reassign populated fields
      {
        $addFields: {
          userId: "$user",
          uniExpertRequestId: "$uniExpertRequest",
        },
      },

      {
        $project: {
          user: 0,
          uniExpertRequest: 0,
        },
      },

      {
        $sort: { createdAt: -1 },
      },
    ]);

    return results;
  }

  return PurchaseModel.find({})
    .populate({
      path: "userId",
      select: "userName email profilePicture preferences",
    })
    .populate({
      path: "uniExpertRequestId",
      populate: [
        { path: "uniExpertId", select: "userName email profilePicture preferences" },
        { path: "studentId", select: "userName email profilePicture preferences" },
      ],
    })
    .sort({ createdAt: -1 });
}

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
  findPurchasesAll,
  createPurchase,
};
