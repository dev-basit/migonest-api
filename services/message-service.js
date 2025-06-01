const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi); // adds .objectId() type :contentReference[oaicite:0]{index=0}

function validateMessage(data) {
  const schema = Joi.object({
    type: Joi.string().valid("text", "image", "video"),
    message: Joi.string().min(1).max(10000).required(),
    senderId: Joi.objectId().required(),
    conversationId: Joi.objectId().required(),
  });

  return schema.validate(data, { abortEarly: false });
}

exports.messageService = { validateMessage };
