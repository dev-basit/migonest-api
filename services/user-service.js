const Joi = require("joi");
const { Response, Constants } = require("../utils");
const { Logger } = require("../startup/logs");
const { userProfileRepository } = require("../repositories");

function validateExperiencePayload(data) {
  const schema = Joi.object({
    jobTitle: Joi.string().min(3).max(128).required(),
    company: Joi.string().min(3).max(128).required(),
    address: Joi.string().min(3).max(128).required(),
    startDate: Joi.string().min(9).max(11).required(),
    endDate: Joi.string().min(9).max(11).optional().allow(""),
  });

  return schema.validate(data);
}

function validateEducationPayload(data) {
  const schema = Joi.object({
    institutionName: Joi.string().min(3).max(128).required(),
    address: Joi.string().min(3).max(128).required(),
    degree: Joi.string().min(3).max(128).required(),
    startDate: Joi.string().min(9).max(11).required(),
    endDate: Joi.string().min(9).max(11).optional().allow(""),
    totalScore: Joi.number().optional().allow(""),
    scoreGained: Joi.number().optional().allow(""),
  });

  return schema.validate(data);
}

function validateIeltsPayload(data) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(128).required(),
    overallScore: Joi.number().min(1).optional().allow(""),
    listening: Joi.number().min(1).optional().allow(""),
    reading: Joi.number().min(1).optional().allow(""),
    writing: Joi.number().min(1).optional().allow(""),
    speaking: Joi.number().min(1).optional().allow(""),
    givenDate: Joi.string().min(9).max(11).required(),
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

exports.userService = {
  experienceCreate,
  educationCreate,
  ieltsCreate,
  validateExperiencePayload,
  validateEducationPayload,
  validateIeltsPayload,
};
