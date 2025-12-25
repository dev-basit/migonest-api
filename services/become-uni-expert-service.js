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

    console.log("\n\n");
    console.log("existingRequests ", existingRequests);

    let isAcceptRequestAlreadyExists = false;

    console.log("\n\n");
    console.log("isAcceptRequestAlreadyExists ", isAcceptRequestAlreadyExists);

    if (existingRequests.length > 0) {
      for (let item of existingRequests) {
        if (item.acceptStatus === Constants.ACCEPT_STATUS || item.acceptStatus === Constants.OPEN_STATUS) {
          isAcceptRequestAlreadyExists = true;
          break;
        }
      }
    }

    console.log("\n\n");
    console.log("isAcceptRequestAlreadyExists ", isAcceptRequestAlreadyExists);

    return isAcceptRequestAlreadyExists;
  } catch (error) {
    throw new Error(error.message);
  }
}

exports.becomeUniExpertService = {
  validateBecomeUniExpertPayload,
  isBecomeUniExpertRequestExists,
};
