const Joi = require("joi");

function validateDocumentPayload(data) {
  const schema = Joi.object({
    label: Joi.string().max(128).required(),
    url: Joi.string().max(1024).required(),
    userId: Joi.string().uuid().optional(),
    universityId: Joi.string().uuid().optional(),
    admissionId: Joi.string().uuid().optional(),
  });

  return schema.validate(data);
}

exports.documentService = { validateDocumentPayload };
