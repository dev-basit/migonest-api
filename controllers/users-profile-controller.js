const { ResponseHandler, Constants } = require("../utils");
const { Logger } = require("../startup/logs");
const { userRepository, userProfileRepository } = require("../repositories");
const { userService } = require("../services");

// TODO: add transaction
const experienceCreate = async (req, res) => {
  try {
    let experience = await userService.experienceCreate(req.body);
    if (experience.status === Constants.FAIL) {
      return ResponseHandler.sendBadResponse(experience.message, res);
    }

    const userUpdate = await userRepository.updateUser(req.user._id, {
      $addToSet: { experiences: experience._id },
    });

    if (!userUpdate) {
      return ResponseHandler.sendBadResponse("Error while updating user.", res);
    }

    return ResponseHandler.sendCreatedResponse(experience, Constants.SUCCESSFULLY_ADDED, res);
  } catch (error) {
    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

const experienceUpdate = async (req, res) => {
  try {
    if (!req.params.id) return ResponseHandler.sendBadResponse(Constants.SEND_ID_IN_PARAMS, res);

    const { error } = userService.validateExperiencePayload(req.body);
    if (error) return ResponseHandler.sendBadResponse(error.details[0].message, res);

    // TODO: optimize this, (remove this api call, save experiences info in token)
    const currentUserDetails = await userRepository.findUserById(req.user._id);

    // normal users can only update their own details and not any other user details
    if (
      (req.user.type === Constants.STUDENT || req.user.type === Constants.UNI_EXPERT) &&
      !currentUserDetails.experiences.includes(req.params.id)
    )
      return ResponseHandler.sendForbiddenResponse(Constants.FORBIDDEN, res);

    Logger.info(Constants.FETCHING_DATA);

    const experienceExisitingDetails = await userProfileRepository.findExperienceById(req.params.id);
    if (!experienceExisitingDetails)
      return ResponseHandler.sendNotFoundResponse(Constants.RESOURCE_NOT_FOUND, res);

    const updatedExperience = await userProfileRepository.updateExperience(req.params.id, req.body);
    if (!updatedExperience) return ResponseHandler.sendBadResponse(Constants.ERROR_UPDATING, res);

    return ResponseHandler.sendOkResponse(updatedExperience, Constants.SUCCESSFULLY_UPDATED, res);
  } catch (error) {
    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

// TODO: add transaction
const educationCreate = async (req, res) => {
  try {
    let education = await userService.educationCreate(req.body);
    if (education.status === Constants.FAIL) {
      return ResponseHandler.sendBadResponse(education.message, res);
    }

    const userUpdate = await userRepository.updateUser(req.user._id, {
      $addToSet: { education: education._id },
    });

    if (!userUpdate) {
      return ResponseHandler.sendBadResponse("Error while updating user.", res);
    }

    return ResponseHandler.sendCreatedResponse(education, Constants.SUCCESSFULLY_ADDED, res);
  } catch (error) {
    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

const educationUpdate = async (req, res) => {
  try {
    if (!req.params.id) return ResponseHandler.sendBadResponse(Constants.SEND_ID_IN_PARAMS, res);

    const { error } = userService.validateEducationPayload(req.body);
    if (error) return ResponseHandler.sendBadResponse(error.details[0].message, res);

    // TODO: optimize this, (remove this api call, save experiences info in token)
    const currentUserDetails = await userRepository.findUserById(req.user._id);

    // normal users can only update their own details and not any other user details
    if (
      (req.user.type === Constants.STUDENT || req.user.type === Constants.UNI_EXPERT) &&
      !currentUserDetails.education.includes(req.params.id)
    )
      return ResponseHandler.sendForbiddenResponse(Constants.FORBIDDEN, res);

    Logger.info(Constants.FETCHING_DATA);

    const educationExisitingDetails = await userProfileRepository.findEducationById(req.params.id);
    if (!educationExisitingDetails)
      return ResponseHandler.sendNotFoundResponse(Constants.RESOURCE_NOT_FOUND, res);

    const updatedEducation = await userProfileRepository.updateEducation(req.params.id, req.body);
    if (!updatedEducation) return ResponseHandler.sendBadResponse(Constants.ERROR_UPDATING, res);

    return ResponseHandler.sendOkResponse(updatedEducation, Constants.SUCCESSFULLY_UPDATED, res);
  } catch (error) {
    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

// TODO: add transaction
const ieltsCreate = async (req, res) => {
  try {
    let ielts = await userService.ieltsCreate(req.body);
    if (ielts.status === Constants.FAIL) {
      return ResponseHandler.sendBadResponse(ielts.message, res);
    }

    const userUpdate = await userRepository.updateUser(req.user._id, {
      $addToSet: { ielts: ielts._id },
    });

    if (!userUpdate) {
      return ResponseHandler.sendBadResponse("Error while updating user.", res);
    }

    return ResponseHandler.sendCreatedResponse(ielts, Constants.SUCCESSFULLY_ADDED, res);
  } catch (error) {
    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

const ieltsUpdate = async (req, res) => {
  try {
    if (!req.params.id) return ResponseHandler.sendBadResponse(Constants.SEND_ID_IN_PARAMS, res);

    const { error } = userService.validateIeltsPayload(req.body);
    if (error) return ResponseHandler.sendBadResponse(error.details[0].message, res);

    // TODO: optimize this, (remove this api call, save experiences info in token)
    const currentUserDetails = await userRepository.findUserById(req.user._id);

    // normal users can only update their own details and not any other user details
    if (
      (req.user.type === Constants.STUDENT || req.user.type === Constants.UNI_EXPERT) &&
      !currentUserDetails.ielts.includes(req.params.id)
    )
      return ResponseHandler.sendForbiddenResponse(Constants.FORBIDDEN, res);

    Logger.info(Constants.FETCHING_DATA);

    const ieltsExisitingDetails = await userProfileRepository.findIeltsById(req.params.id);
    if (!ieltsExisitingDetails)
      return ResponseHandler.sendNotFoundResponse(Constants.RESOURCE_NOT_FOUND, res);

    const updatedIelts = await userProfileRepository.updateIelts(req.params.id, req.body);
    if (!updatedIelts) return ResponseHandler.sendBadResponse(Constants.ERROR_UPDATING, res);

    return ResponseHandler.sendOkResponse(updatedIelts, Constants.SUCCESSFULLY_UPDATED, res);
  } catch (error) {
    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

exports.usersProfileControllers = {
  experienceCreate,
  experienceUpdate,
  educationCreate,
  educationUpdate,
  ieltsCreate,
  ieltsUpdate,
};
