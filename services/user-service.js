const bcrypt = require("bcrypt");
const _ = require("lodash");
const { UserModel } = require("../models");
const { validatePayload, ResponseHandler, Response, Constants } = require("../utils");
const { Logger } = require("../startup/logs");

const Users = async (req, res) => {
  try {
    Logger.info(Constants.FETCHING_DATA);
    const users = await UserModel.find().select("-password");
    return ResponseHandler.sendOkResponse(users, Constants.SUCCESSFULLY_FETCED, res);
  } catch (error) {
    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

const UserCreate = async (req, res) => {
  try {
    const { error } = validatePayload.userCreate(req.body);
    if (error) return ResponseHandler.sendBadResponse(error.details[0].message, res);

    Logger.info(Constants.PAYLOAD_IS_CORRECT);

    let user = await UserModel.findOne({ email: req.body.email });
    if (user) return ResponseHandler.sendBadResponse(Constants.NEW_USER_EMAIL_CLASH, res);

    Logger.info(Constants.EMAI_IS_UNIQUE);

    user = new UserModel(_.pick(req.body, ["name", "email", "password", "phoneNo", "type"]));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    Logger.info(Constants.SUCCESSFULLY_ADDED);

    const token = user.generateAuthToken();
    return res
      .header("x-auth-token", token)
      .header("access-control-expose-headers", "x-auth-token")
      .status(Constants.HTTP_STATUS_CODES.CREATED)
      .send(
        new Response(
          _.pick(user, ["_id", "name", "email", "type"]),
          Constants.HTTP_STATUS_CODES.CREATED,
          Constants.SUCCESSFULLY_ADDED,
          Constants.SUCCESS
        )
      );
  } catch (error) {
    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

// TODO: dont't allow email && password update here, write separate api for it
const UserUpdate = async (req, res) => {
  try {
    if (!req.body.id) return ResponseHandler.sendBadResponse(Constants.SEND_ID_IN_PAYLOAD, res);

    // normal users can only update their own details and not any other user details
    if (req.user.type === "user" && req.user._id !== req.body.id)
      return ResponseHandler.sendUnauthorizedResponse(Constants.UNAUTHORIZED, res);

    Logger.info(Constants.FETCHING_DATA);

    const userExisitingDetails = await UserModel.findById(req.body.id);
    if (!userExisitingDetails) return ResponseHandler.sendNotFoundResponse(Constants.RESOURCE_NOT_FOUND, res);

    // Avoid email and password update
    const userNewDetails = {
      name: req.body.name || userExisitingDetails.name,
      email: userExisitingDetails.email,
      password: userExisitingDetails.password,
      phoneNo: req.body.phoneNo || userExisitingDetails.phoneNo,
      type: req.body.type || userExisitingDetails.type,
      aboutMe: req.body.aboutMe || userExisitingDetails.aboutMe,
    };

    const updatedUser = await UserModel.findByIdAndUpdate(req.body.id, userNewDetails, {
      new: true,
    });
    if (!updatedUser) return ResponseHandler.sendBadResponse(Constants.ERROR_UPDATING, res);

    return ResponseHandler.sendOkResponse(updatedUser, Constants.SUCCESSFULLY_UPDATED, res);
  } catch (error) {
    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

const UserDetails = async (req, res) => {
  try {
    if (!req.params.id) return ResponseHandler.sendBadResponse(Constants.SEND_ID_IN_PARAMS, res);

    // normal users can not see the details of other users except their own
    if (req.user.type === "user" && req.user._id !== req.params.id)
      return ResponseHandler.sendUnauthorizedResponse(Constants.UNAUTHORIZED, res);

    Logger.info(Constants.FETCHING_DATA);

    const user = await UserModel.findById(req.params.id).select("-password");
    if (!user) return ResponseHandler.sendNotFoundResponse(Constants.DATA_NOT_FOUND, res);

    return ResponseHandler.sendOkResponse(user, Constants.SUCCESSFULLY_FETCED, res);
  } catch (error) {
    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

exports.UserService = { Users, UserCreate, UserUpdate, UserDetails };
