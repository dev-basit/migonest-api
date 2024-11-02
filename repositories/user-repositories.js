const bcrypt = require("bcrypt");
const _ = require("lodash");
const { UserModel } = require("../models");
const { Utils } = require("../utils");

// dont fetch password
const findUser = async (params = {}) => {
  try {
    return await UserModel.findOne(params).select("-password");
  } catch (error) {
    throw new Error(error.message);
  }
};

// fetch password as well
const findUserWithPassword = async (params = {}) => {
  try {
    return await UserModel.findOne(params);
  } catch (error) {
    throw new Error(error.message);
  }
};

const findUserDetails = async (params = {}) => {
  try {
    return await UserModel.findOne(params)
      .select("-password")
      .populate("experiences")
      .populate("education")
      .populate("ielts");
  } catch (error) {
    throw new Error(error.message);
  }
};

const findUserById = async (id) => {
  try {
    return await UserModel.findById(id)
      .select("-password")
      .populate("following", "_id userName firstName lastName profilePicture type");
  } catch (error) {
    throw new Error(error.message);
  }
};

const findUsers = async (params = {}) => {
  try {
    return await UserModel.find(params).select("-password");
  } catch (error) {
    throw new Error(error.message);
  }
};

const findUsersSuggestions = async (params = {}) => {
  try {
    return await UserModel.find(params).select("_id userName profilePicture preferences");
  } catch (error) {
    throw new Error(error.message);
  }
};

const createUser = async (newUserData) => {
  try {
    const user = new UserModel(
      _.pick(newUserData, [
        "_id",
        "userName",
        "firstName",
        "lastName",
        "email",
        "password",
        "profilePicture",
        "date",
        "gender",
        "type",
      ])
    );
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    user.emailVerificationCode = Utils.generateCode(6); // generate code, used to verify email
    await user.save();
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateUser = async (userId, updatedData, options = { new: true }) => {
  try {
    return await UserModel.findByIdAndUpdate(userId, updatedData, options);
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.userRepository = {
  findUser,
  findUserById,
  findUserWithPassword,
  findUserDetails,
  findUsers,
  findUsersSuggestions,
  createUser,
  updateUser,
};
