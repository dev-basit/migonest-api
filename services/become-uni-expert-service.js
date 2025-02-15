const Joi = require("joi");
const { becomeUniExpertsRepository } = require("../repositories");
const { Constants } = require("../utils");

function validateBecomeUniExpertPayload(data) {
  const schema = Joi.object({
    studentId: Joi.string().length(24).required(),
    acceptStatus: Joi.string().valid("open", "accepted", "rejected").default("open"),
    // createdAt: Joi.string().min(9).max(11),
    // updatedAt: Joi.string().min(9).max(11),
  });

  return schema.validate(data);
}

async function isBecomeUniExpertRequestExists(studentId) {
  try {
    const existingRequests = await becomeUniExpertsRepository.findBecomeUniExperts({ studentId: studentId });

    let isAcceptRequestAlreadyExists = false;

    if (existingRequests.length > 0) {
      for (let item of existingRequests) {
        if (item.acceptStatus === Constants.ACCEPT_STATUS || item.acceptStatus === Constants.OPEN_STATUS) {
          isAcceptRequestAlreadyExists = true;
          break;
        }
      }
    }

    return isAcceptRequestAlreadyExists;
  } catch (error) {
    throw new Error(error.message);
  }
}

exports.becomeUniExpertService = {
  validateBecomeUniExpertPayload,
  isBecomeUniExpertRequestExists,
};
