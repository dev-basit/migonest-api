const Joi = require("joi");
const { uniExpertRequestRepository } = require("../repositories");
const { Constants } = require("../utils");

function validateCreateUniExpertRequestPayload(data) {
  const schema = Joi.object({
    uniExpertId: Joi.string().length(24).required(),
    studentId: Joi.string().length(24).required(),
    universityId: Joi.string().length(24).required(),
    acceptStatus: Joi.string().valid("open", "accepted", "rejected").default("open"),
    paymentStatus: Joi.boolean().default(false),
    createdAt: Joi.string().min(9).max(11),
    updatedAt: Joi.string().min(9).max(11),
  });

  return schema.validate(data);
}

async function isAcceptRequestAlreadyExists(studentId, universityId) {
  try {
    const existingRequests = await uniExpertRequestRepository.findUniExpertRequests({
      studentId: studentId,
      universityId: universityId,
    });

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

exports.uniExpertRequestService = { validateCreateUniExpertRequestPayload, isAcceptRequestAlreadyExists };
