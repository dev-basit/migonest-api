const mongoose = require("mongoose");
const _ = require("lodash");
const {
  validatePayload,
  ResponseHandler,
  Response,
  Constants,
  sendEmail,
  stripe,
  html,
} = require("../utils");
const { Logger } = require("../startup/logs");
const { userRepository } = require("../repositories");
const { userService } = require("../services");

const users = async (req, res) => {
  try {
    const filters = {};
    if (req.query.name) {
      const name = req.query.name;
      filters.$or = [
        { firstName: { $regex: name, $options: "i" } },
        { lastName: { $regex: name, $options: "i" } },
      ];
    }

    Logger.info(Constants.FETCHING_DATA);
    const users = await userRepository.findUsersPublic(filters);
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

    const stripeCustomer = await stripe.customers.create({
      name: req.body.firstName + " " + req.body.lastName,
      email: req.body.email,
    });

    if (!stripeCustomer.id)
      return ResponseHandler.sendInternalServerErrorResponse("Error while generating stripe id.", res);

    user = await userRepository.createUser({
      ...req.body,
      stripeCustomerId: stripeCustomer.id,
    });

    Logger.info(Constants.SUCCESSFULLY_ADDED);

    await sendEmail({ receiver: user.email, text: html.verificationEmail(user.emailVerificationCode) });

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
            // "stripeCustomerId",
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
      coverPicture: req.body.coverPicture || userExisitingDetails.coverPicture,
      email: userExisitingDetails.email,
      password: userExisitingDetails.password,
      isVerified: userExisitingDetails.isVerified,
      emailVerificationCode: userExisitingDetails.emailVerificationCode,
      date: req.body.date || userExisitingDetails.date,
      gender: req.body.gender || userExisitingDetails.gender,
      type: req.body.type || userExisitingDetails.type,
      preferences: req.body.preferences || userExisitingDetails.preferences,
      about: req.body.about || userExisitingDetails.about,
      documents: req.body.documents || userExisitingDetails.documents || [],
      stripeCustomerId: userExisitingDetails.stripeCustomerId,
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

    Logger.info(Constants.FETCHING_DATA);

    const user = await userRepository.findUserDetailsById(req.params.id);
    if (!user) return ResponseHandler.sendNotFoundResponse(Constants.DATA_NOT_FOUND, res);

    user["password"] = null;

    return ResponseHandler.sendOkResponse(user, Constants.SUCCESSFULLY_FETCED, res);
  } catch (error) {
    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

const currentUserDetails = async (req, res) => {
  try {
    Logger.info(Constants.FETCHING_DATA);
    const currentUser = await userRepository.findUserDetails({ _id: req.user._id });
    return ResponseHandler.sendOkResponse(currentUser, Constants.SUCCESSFULLY_FETCED, res);
  } catch (error) {
    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

const followUser = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userId } = req.body;
    if (!userId) return ResponseHandler.sendBadResponse("Please send user's id to follow.", res);

    if (userId === req.user._id.toString())
      return ResponseHandler.sendBadResponse("You cannot follow yourself.", res);

    const userToFollow = await userRepository.findUserById(userId);
    if (!userToFollow) return ResponseHandler.sendNotFoundResponse("User to follow does not exist.", res);

    const isAlreadyFollowingUser = await userRepository.findUser({ _id: req.user._id, following: userId });
    if (isAlreadyFollowingUser)
      return ResponseHandler.sendBadResponse("You are already following this user.", res);

    Logger.info("Following the user.");
    await userRepository.updateUser(req.user._id, { $addToSet: { following: userId } }); // add user to following list of the current user
    await userRepository.updateUser(userId, { $addToSet: { followers: req.user._id } }); // add current user to follower list of the user that is followed

    await session.commitTransaction();
    session.endSession();

    return ResponseHandler.sendOkResponse(null, "Successfully followed the user.", res);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

const userSuggestions = async (req, res) => {
  try {
    const userId = req.user._id;
    const type = req.query.type;
    const linkedUsers = req.query.linkedUsers === "true";

    const suggestedUsers = await userService.userSuggestions(userId, type, linkedUsers);
    return ResponseHandler.sendOkResponse(suggestedUsers, Constants.SUCCESSFULLY_FETCED, res);
  } catch (error) {
    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

const network = async (req, res) => {
  try {
    const userId = req.user._id;
    const showFollowers = req.query.showFollowers === "true";

    const currentUser = await userRepository.findUserById(userId);
    if (!currentUser) throw new Error(Constants.USER_NOT_FOUND);

    const filters = {};

    if (!showFollowers) {
      const excludeUserIds = currentUser.following.concat(userId);
      filters._id = { $nin: excludeUserIds };
    } else {
      filters._id = { $in: currentUser.following };
    }

    Logger.info(Constants.FETCHING_DATA);

    const network = await userRepository.findUsersSuggestions(filters);
    return ResponseHandler.sendOkResponse(network, Constants.SUCCESSFULLY_FETCED, res);
  } catch (error) {
    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

const updatePreferences = async (req, res) => {
  try {
    if (!req.body.id) return ResponseHandler.sendBadResponse(Constants.SEND_ID_IN_PAYLOAD, res);

    // normal users can only update their own preferences and not any other user preferences
    if (
      (req.user.type === Constants.STUDENT || req.user.type === Constants.UNI_EXPERT) &&
      req.user._id !== req.body.id
    )
      return ResponseHandler.sendForbiddenResponse(Constants.FORBIDDEN, res);

    Logger.info(Constants.FETCHING_DATA);

    const userExisitingDetails = await userRepository.findUserById(req.body.id);
    if (!userExisitingDetails) return ResponseHandler.sendNotFoundResponse(Constants.RESOURCE_NOT_FOUND, res);

    const updatedUser = await userRepository.updateUser(req.body.id, {
      preferences: req.body.preferences || userExisitingDetails.preferences,
    });
    if (!updatedUser) return ResponseHandler.sendBadResponse(Constants.ERROR_UPDATING, res);

    // dont send user password to the consumer
    updatedUser.password = null;

    const token = updatedUser.generateAuthToken();
    return res
      .header("x-auth-token", token)
      .header("access-control-expose-headers", "x-auth-token")
      .status(Constants.HTTP_STATUS_CODES.OK)
      .send(
        new Response(
          _.pick(updatedUser, [
            "_id",
            "userName",
            "firstName",
            "lastName",
            "email",
            "profilePicture",
            "date",
            "gender",
            "type",
            // "stripeCustomerId",
          ]),
          Constants.HTTP_STATUS_CODES.OK,
          Constants.SUCCESSFULLY_CREATED_USER,
          Constants.SUCCESS
        )
      );
  } catch (error) {
    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

exports.usersControllers = {
  users,
  userCreate,
  userUpdate,
  userDetails,
  currentUserDetails,
  followUser,
  userSuggestions,
  network,
  updatePreferences,
};
