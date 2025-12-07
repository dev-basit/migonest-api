const Joi = require("joi");
const { uniExpertRequestRepository } = require("../repositories");
const { Constants } = require("../utils");

function validateCreateUniExpertRequestPayload(data) {
  const schema = Joi.object({
    uniExpertId: Joi.string().guid({ version: "uuidv4" }).required(),
    studentId: Joi.string().guid({ version: "uuidv4" }).required(),
    universityId: Joi.string().guid({ version: "uuidv4" }).required(),
    acceptStatus: Joi.string().valid("OPEN", "ACCEPTED", "REJECTED").default("OPEN"),
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
