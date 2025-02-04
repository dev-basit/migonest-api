const Joi = require("joi");

function validateCreateUniExpertRequestPayload(data) {
  const schema = Joi.object({
    uniExpertId: Joi.string().length(24).required(),
    studentId: Joi.string().length(24).required(),
    universityId: Joi.string().length(24).required(),
    acceptStatus: Joi.boolean().default(false),
    paymentStatus: Joi.boolean().default(false),
    createdAt: Joi.string().min(9).max(11),
    updatedAt: Joi.string().min(9).max(11),
  });

  return schema.validate(data);
}

exports.uniExpertRequestService = { validateCreateUniExpertRequestPayload };
