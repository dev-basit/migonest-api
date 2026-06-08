const Joi = require("joi");
const { becomeUniExpertsRepository } = require("../repositories");
const { Constants } = require("../utils");

function validateBecomeUniExpertPayload(data) {
  const schema = Joi.object({
    studentId: Joi.string().guid({ version: "uuidv4" }).required(),
    acceptStatus: Joi.string().valid("OPEN", "ACCEPTED", "REJECTED").default("OPEN"),
    // createdAt: Joi.string().min(9).max(11),
    // updatedAt: Joi.string().min(9).max(11),
  });

  return schema.validate(data);
}

async function isBecomeUniExpertRequestExists(studentId) {
  try {
    const existingRequests = await becomeUniExpertsRepository.findBecomeUniExperts({ studentId: studentId });
    return existingRequests.length > 0;
  } catch (error) {
    throw new Error(error.message);
  }
}

exports.becomeUniExpertService = {
  validateBecomeUniExpertPayload,
  isBecomeUniExpertRequestExists,
};
