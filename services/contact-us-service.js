const Joi = require("joi");

function validateContactUsPayload(data) {
  const schema = Joi.object({
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required(),
    phone: Joi.string().min(5).max(20).required(),
    message: Joi.string().min(5).max(500).required(),
  });

  return schema.validate(data);
}

exports.contactUsService = { validateContactUsPayload };
