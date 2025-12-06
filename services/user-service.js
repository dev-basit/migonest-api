const Joi = require("joi");
const { Response, Constants } = require("../utils");
const { Logger } = require("../startup/logs");
const { userProfileRepository, userRepository, uniExpertRequestRepository } = require("../repositories");

function validateExperiencePayload(data) {
  const schema = Joi.object({
    userId: Joi.string().guid({ version: "uuidv4" }).required(),
    jobTitle: Joi.string().min(3).max(128).required(),
    company: Joi.string().min(3).max(128).required(),
    address: Joi.string().min(3).max(128).required(),
    startDate: Joi.date().iso().required(),
    endDate: Joi.date().iso().optional().allow(""),
  });

  return schema.validate(data);
}

function validateEducationPayload(data) {
  const schema = Joi.object({
    userId: Joi.string().guid({ version: "uuidv4" }).required(),
    institutionName: Joi.string().min(3).max(128).required(),
    address: Joi.string().min(3).max(128).required(),
    degree: Joi.string().min(3).max(128).required(),
    startDate: Joi.date().iso().required(),
    endDate: Joi.date().iso().optional().allow(""),
    totalScore: Joi.number().optional().allow(""),
    scoreGained: Joi.number().optional().allow(""),
  });

  return schema.validate(data);
}

function validateIeltsPayload(data) {
  const schema = Joi.object({
    userId: Joi.string().guid({ version: "uuidv4" }).required(),
    name: Joi.string().min(3).max(128).required(),
    overallScore: Joi.number().min(1).optional().allow(""),
    listening: Joi.number().min(1).optional().allow(""),
    reading: Joi.number().min(1).optional().allow(""),
    writing: Joi.number().min(1).optional().allow(""),
    speaking: Joi.number().min(1).optional().allow(""),
    givenDate: Joi.date().iso().required(),
  });

  return schema.validate(data);
}

const experienceCreate = async (data) => {
  try {
    const { error } = validateExperiencePayload(data);
    if (error) {
      return new Response(
        null,
        Constants.HTTP_STATUS_CODES.BAD_REQUEST,
        error.details[0].message,
        Constants.FAIL
      );
    }

    Logger.info(Constants.PAYLOAD_IS_CORRECT);

    return await userProfileRepository.createExperience(data);
  } catch (error) {
    throw new Error(error.message);
  }
};

const educationCreate = async (data) => {
  try {
    const { error } = validateEducationPayload(data);
    if (error) {
      return new Response(
        null,
        Constants.HTTP_STATUS_CODES.BAD_REQUEST,
        error.details[0].message,
        Constants.FAIL
      );
    }

    Logger.info(Constants.PAYLOAD_IS_CORRECT);

    return await userProfileRepository.createEducation(data);
  } catch (error) {
    throw new Error(error.message);
  }
};

const ieltsCreate = async (data) => {
  try {
    const { error } = validateIeltsPayload(data);
    if (error) {
      return new Response(
        null,
        Constants.HTTP_STATUS_CODES.BAD_REQUEST,
        error.details[0].message,
        Constants.FAIL
      );
    }

    Logger.info(Constants.PAYLOAD_IS_CORRECT);

    return await userProfileRepository.createIelts(data);
  } catch (error) {
    throw new Error(error.message);
  }
};

const userSuggestions = async (userId, type, linkedUsers) => {
  try {
    const currentUser = await userRepository.findUserDetails({ id: userId });
    if (!currentUser) throw new Error(Constants.USER_NOT_FOUND);

    const excludeUserIds = currentUser.following.map((following) => following.id).concat(userId);
    let filters = { id: { notIn: excludeUserIds } };
    if (type) filters.type = type;

    if (linkedUsers) {
      if (currentUser.type === Constants.STUDENT) {
        const paymentDoneToUniExperts = (
          await uniExpertRequestRepository.findUniExpertRequests({ studentId: userId })
        )
          .filter((request) => request.paymentStatus === true)
          .map((request) => request.uniExpertId.id);

        filters.id = { in: paymentDoneToUniExperts };
      } else if (currentUser.type === Constants.UNI_EXPERT) {
        const paymentDoneByStudents = (
          await uniExpertRequestRepository.findUniExpertRequests({ uniExpertId: userId })
        )
          .filter((request) => request.paymentStatus === true)
          .map((request) => request.studentId.id);

        filters.id = { in: paymentDoneByStudents };
      }
    }

    Logger.info(Constants.FETCHING_DATA);

    return await userRepository.findUsersSuggestions(filters, {
      pageSize: Constants.PAGE_SIZE,
      skip: 0,
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.userService = {
  experienceCreate,
  educationCreate,
  ieltsCreate,
  validateExperiencePayload,
  validateEducationPayload,
  validateIeltsPayload,
  userSuggestions,
};
