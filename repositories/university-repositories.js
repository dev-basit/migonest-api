const { UniversityModel } = require("../models");

const findUniversities = async (params = {}, { skip, pageSize }) => {
  try {
    const [universities, count] = await Promise.all([
      UniversityModel.find(params)
        .populate("uniExpertId", "_id userName firstName lastName profilePicture type")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean(),
      UniversityModel.countDocuments(params),
    ]);
    return { universities, count };
  } catch (error) {
    throw new Error(error.message);
  }
};

const findUniversityById = async (id) => {
  try {
    return await UniversityModel.findById(id);
  } catch (error) {
    throw new Error(error.message);
  }
};

const createUniversity = async (data) => {
  try {
    const university = new UniversityModel(data);
    return await university.save();
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateUniversity = async (id, updatedData, options = { new: true }) => {
  try {
    return await UniversityModel.findByIdAndUpdate(id, updatedData, options);
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
