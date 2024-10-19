const _ = require("lodash");
const { validatePayload, ResponseHandler, Response, Constants, sendEmail } = require("../utils");
const { Logger } = require("../startup/logs");
const { userRepository } = require("../repositories");

const users = async (req, res) => {
  try {
    Logger.info(Constants.FETCHING_DATA);
    const users = await userRepository.findUsers();
    return ResponseHandler.sendOkResponse(users, Constants.SUCCESSFULLY_FETCED, res);
  } catch (error) {
    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

const userCreate = async (req, res) => {
  try {
    const { error } = validatePayload.userCreate(req.body);
    if (error) return ResponseHandler.sendBadResponse(error.details[0].message, res);

    Logger.info(Constants.PAYLOAD_IS_CORRECT);

    let user = await userRepository.findUser({ email: req.body.email });
    if (user) return ResponseHandler.sendConflictResponse(Constants.NEW_USER_EMAIL_CLASH, res);

    Logger.info(Constants.EMAI_IS_UNIQUE);

    user = await userRepository.createUser(req.body);

    Logger.info(Constants.SUCCESSFULLY_ADDED);

    await sendEmail({ receiver: user.email, code: user.emailVerificationCode }); // send code for verification

    const token = user.generateAuthToken();
    return res
      .header("x-auth-token", token)
      .header("access-control-expose-headers", "x-auth-token")
      .status(Constants.HTTP_STATUS_CODES.CREATED)
      .send(
        new Response(
          _.pick(user, [
            "_id",
            "userName",
            "firstName",
            "lastName",
            "email",
            "profilePicture",
            "date",
            "gender",
            "type",
          ]),
          Constants.HTTP_STATUS_CODES.CREATED,
          Constants.SUCCESSFULLY_CREATED_USER,
          Constants.SUCCESS
        )
      );
  } catch (error) {
    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

// TODO: dont't allow email, password, isVerified, emailVerificationCode update here, write separate api for it
const userUpdate = async (req, res) => {
  try {
    if (!req.body.id) return ResponseHandler.sendBadResponse(Constants.SEND_ID_IN_PAYLOAD, res);

    // normal users can only update their own details and not any other user details
    if (
      (req.user.type === Constants.STUDENT || req.user.type === Constants.UNI_EXPERT) &&
      req.user._id !== req.body.id
    )
      return ResponseHandler.sendForbiddenResponse(Constants.FORBIDDEN, res);

    Logger.info(Constants.FETCHING_DATA);

    const userExisitingDetails = await userRepository.findUserById(req.body.id);
    if (!userExisitingDetails) return ResponseHandler.sendNotFoundResponse(Constants.RESOURCE_NOT_FOUND, res);

    // Avoid email, password, isVerified, emailVerificationCode update
    const userUpdatedDetails = {
      userName: req.body.userName || userExisitingDetails.userName,
      firstName: req.body.firstName || userExisitingDetails.firstName,
      lastName: req.body.lastName || userExisitingDetails.lastName,
      profilePicture: req.body.profilePicture || userExisitingDetails.profilePicture,
      email: userExisitingDetails.email,
      password: userExisitingDetails.password,
      isVerified: userExisitingDetails.isVerified,
      emailVerificationCode: userExisitingDetails.emailVerificationCode,
      date: req.body.date || userExisitingDetails.date,
      gender: req.body.gender || userExisitingDetails.gender,
      type: req.body.type || userExisitingDetails.type,
      preferences: req.body.preferences || userExisitingDetails.preferences,
    };

    const updatedUser = await userRepository.updateUser(req.body.id, userUpdatedDetails);
    if (!updatedUser) return ResponseHandler.sendBadResponse(Constants.ERROR_UPDATING, res);

    // dont send user password to the consumer
    updatedUser.password = null;

    return ResponseHandler.sendOkResponse(updatedUser, Constants.SUCCESSFULLY_UPDATED, res);
  } catch (error) {
    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

const userDetails = async (req, res) => {
  try {
    if (!req.params.id) return ResponseHandler.sendBadResponse(Constants.SEND_ID_IN_PARAMS, res);

    // normal users can not see the details of other users except their own
    if (
      (req.user.type === Constants.STUDENT || req.user.type === Constants.UNI_EXPERT) &&
      req.user._id !== req.params.id
    )
      return ResponseHandler.sendForbiddenResponse(Constants.FORBIDDEN, res);

    Logger.info(Constants.FETCHING_DATA);

    const user = await userRepository.findUserById(req.params.id);
    if (!user) return ResponseHandler.sendNotFoundResponse(Constants.DATA_NOT_FOUND, res);

    user["password"] = null;

    return ResponseHandler.sendOkResponse(user, Constants.SUCCESSFULLY_FETCED, res);
  } catch (error) {
    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

exports.usersControllers = { users, userCreate, userUpdate, userDetails };
