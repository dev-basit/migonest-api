const Joi = require("joi");

function validateUniversityCreatePayload(data) {
  const schema = Joi.object({
    name: Joi.string().max(255).required(),
    requirements: Joi.array().items(Joi.string()).default([]),
    deadline: Joi.string().min(9).max(11).required(),
    tuitionFee: Joi.string().min(1).max(15).required(),
    applicationFee: Joi.string().min(1).max(15).required(),
    documents: Joi.array()
      .items(
        Joi.object({
          label: Joi.string().required(),
          url: Joi.string().uri().required(),
        })
      )
      .default([]),
    uniExpertId: Joi.string().length(24).required(),
    location: Joi.string().max(255),
  });

  return schema.validate(data);
}

exports.universityService = { validateUniversityCreatePayload };
