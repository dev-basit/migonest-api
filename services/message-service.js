const Joi = require("joi");

function validateMessage(data) {
  const schema = Joi.object({
    type: Joi.string().valid("text", "image", "video"),
    message: Joi.string().min(1).max(10000).required(),
    senderId: Joi.string().guid({ version: "uuidv4" }).required(),
    conversationId: Joi.string().guid({ version: "uuidv4" }).required(),
  });

  return schema.validate(data, { abortEarly: false });
}

exports.messageService = { validateMessage };
