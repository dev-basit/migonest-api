const Joi = require("joi");

function validateUniversityCreatePayload(data) {
  const schema = Joi.object({
    name: Joi.string().max(255).required(),
    requirements: Joi.array().items(Joi.string()).default([]),
    deadline: Joi.date().iso().required(),
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
    uniExpertId: Joi.string().guid({ version: "uuidv4" }).required(),
    location: Joi.string().max(512).allow(null),
  });

  return schema.validate(data);
}

function validateUniversityUpdatePayload(data) {
  const schema = Joi.object({
    id: Joi.string().guid({ version: "uuidv4" }).required(),
    name: Joi.string().max(255).required(),
    requirements: Joi.array().items(Joi.string()).default([]),
    deadline: Joi.date().iso().required(),
    tuitionFee: Joi.string().min(1).max(15).required(),
    applicationFee: Joi.string().min(1).max(15).required(),
    documents: Joi.array()
      .items(
        Joi.object({
          id: Joi.string().guid({ version: "uuidv4" }),
          label: Joi.string().required(),
          url: Joi.string().uri().required(),
        })
      )
      .default([]),
    uniExpertId: Joi.string().guid({ version: "uuidv4" }).required(),
    location: Joi.string().max(512).allow(null),
  });

  return schema.validate(data);
}

exports.universityService = { validateUniversityCreatePayload, validateUniversityUpdatePayload };
