const Joi = require("joi");

function validateAdmissionCreatePayload(data) {
  const schema = Joi.object({
    step: Joi.number().min(1).max(8),
    uniExpertRequestId: Joi.string().length(24).required(),
    documents: Joi.array()
      .items(
        Joi.object({
          label: Joi.string().required(),
          url: Joi.string().uri().required(),
        })
      )
      .default([]),
  });

  return schema.validate(data);
}

exports.admissionService = { validateAdmissionCreatePayload };
