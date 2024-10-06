const bcrypt = require("bcrypt");
const _ = require("lodash");
const { UserModel } = require("../models");

const findUser = async (params = {}) => {
  try {
    return await UserModel.findOne(params);
  } catch (error) {
    throw new Error(error.message);
  }
};

const findUserById = async (id) => {
  try {
    return await UserModel.findById(id);
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

const createUser = async (newUserData) => {
  try {
    const user = new UserModel(_.pick(newUserData, ["name", "email", "password", "phoneNo", "type"]));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateUser = async (userId, updatedData) => {
  try {
    return await UserModel.findByIdAndUpdate(userId, updatedData, { new: true });
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.userRepository = { findUser, findUserById, findUsers, createUser, updateUser };
