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

const findUserDetailsById = async (id) => {
  try {
    return await UserModel.findById(id)
      .select("-password -email -date -gender")
      .populate("experiences")
      .populate("education")
      .populate("ielts");
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

// gets minimum info to be used by public
const findUsersPublic = async (params = {}) => {
  try {
    return await UserModel.find(params).select("_id userName firstName lastName profilePicture");
  } catch (error) {
    throw new Error(error.message);
  }
};

const findUsersSuggestions = async (params = {}, { skip, pageSize }) => {
  try {
    const [users, count] = await Promise.all([
      UserModel.find(params)
        .select("_id userName profilePicture preferences type")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean(),
      UserModel.countDocuments(params),
    ]);
    return { users, count };
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
        "stripeCustomerId",
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
  findUsersPublic,
  findUserDetails,
  findUserDetailsById, // public info
  findUsers,
  findUsersSuggestions,
  createUser,
  updateUser,
};
