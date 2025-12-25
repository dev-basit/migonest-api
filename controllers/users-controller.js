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
  generateUserAuthToken,
} = require("../utils");
const { Logger } = require("../startup/logs");
const { userRepository } = require("../repositories");
const { userService } = require("../services");

const users = async (req, res) => {
  try {
    const filters = {};
    if (req.query.name) {
      const name = req.query.name;
      filters.OR = [
        { firstName: { contains: name, mode: "insensitive" } },
        { lastName: { contains: name, mode: "insensitive" } },
      ];
    }

    const { pageNo, pageSize, skip } = req.pagination;

    Logger.info(Constants.FETCHING_DATA);

    const { users, count } = await userRepository.findUsersPublic(filters, { skip, pageSize });
    return ResponseHandler.sendOkResponse(
      { users, pagination: { count, pageNo, pageSize, totalPages: Math.ceil(count / pageSize) } },
      Constants.SUCCESSFULLY_FETCED,
      res
    );
  } catch (error) {
    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

const userCreate = async (req, res) => {
  try {
    const { error } = validatePayload.userCreate(req.body);
    if (error) return ResponseHandler.sendBadResponse(error.details[0].message, res);

    Logger.info(Constants.PAYLOAD_IS_CORRECT);

    let user = await userRepository.findUser({
      OR: [{ email: req.body.email }, { userName: req.body.userName }],
    });
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

    const token = generateUserAuthToken(user);
    return res
      .header("x-auth-token", token)
      .header("access-control-expose-headers", "x-auth-token")
      .status(Constants.HTTP_STATUS_CODES.CREATED)
      .send(
        new Response(
          _.pick(user, [
            "id",
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
      req.user.id !== req.body.id
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
      dateOfBirth: req.body.dateOfBirth || userExisitingDetails.dateOfBirth,
      gender: req.body.gender || userExisitingDetails.gender,
      type: req.body.type || userExisitingDetails.type,
      preferences: req.body.preferences || userExisitingDetails.preferences,
      about: req.body.about || userExisitingDetails.about,
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
    const currentUser = await userRepository.findUserDetails({ id: req.user.id });
    return ResponseHandler.sendOkResponse(currentUser, Constants.SUCCESSFULLY_FETCED, res);
  } catch (error) {
    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

const followUser = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return ResponseHandler.sendBadResponse("Please send user's id to follow.", res);

    if (userId === req.user.id.toString())
      return ResponseHandler.sendBadResponse("You cannot follow yourself.", res);

    const userToFollow = await userRepository.findUserById(userId);
    if (!userToFollow) return ResponseHandler.sendNotFoundResponse("User to follow does not exist.", res);

    const isAlreadyFollowingUser = await userRepository.findUserFollowers({
      followerId_followingId: { followerId: req.user.id, followingId: userId },
    });
    if (isAlreadyFollowingUser)
      return ResponseHandler.sendBadResponse("You are already following this user.", res);

    Logger.info("Following the user.");
    await userRepository.addFollowRelationship(req.user.id, userId);

    return ResponseHandler.sendOkResponse(null, "Successfully followed the user.", res);
  } catch (error) {
    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

const userSuggestions = async (req, res) => {
  try {
    const userId = req.user.id;
    const type = req.query.type;
    const linkedUsers = req.query.linkedUsers === "true";

    const { users: suggestedUsers } = await userService.userSuggestions(userId, type, linkedUsers);
    return ResponseHandler.sendOkResponse(suggestedUsers, Constants.SUCCESSFULLY_FETCED, res);
  } catch (error) {
    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

const network = async (req, res) => {
  try {
    const userId = req.user.id;
    const showFollowers = req.query.showFollowers === "true";
    const { pageNo, pageSize, skip } = req.pagination;

    const currentUser = await userRepository.findUserDetailsById(userId);
    if (!currentUser) throw new Error(Constants.USER_NOT_FOUND);

    const filters = {};

    if (!showFollowers) {
      const excludeUserIds = currentUser.following.map((following) => following.followingId).concat(userId);
      filters.id = { notIn: excludeUserIds };
    } else {
      filters.id = { in: currentUser.following.map((following) => following.followingId) };
    }

    Logger.info(Constants.FETCHING_DATA);

    const { users: network, count } = await userRepository.findUsersSuggestions(filters, { skip, pageSize });
    return ResponseHandler.sendOkResponse(
      { network, pagination: { count, pageNo, pageSize, totalPages: Math.ceil(count / pageSize) } },
      Constants.SUCCESSFULLY_FETCED,
      res
    );
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
      req.user.id !== req.body.id
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

    const token = generateUserAuthToken(updatedUser);
    return res
      .header("x-auth-token", token)
      .header("access-control-expose-headers", "x-auth-token")
      .status(Constants.HTTP_STATUS_CODES.OK)
      .send(
        new Response(
          _.pick(updatedUser, [
            "id",
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
