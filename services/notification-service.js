const Joi = require("joi");

function validateNotification(data) {
  const schema = Joi.object({
    userId: Joi.string().guid({ version: "uuidv4" }).required(),
    type: Joi.string().valid("REQUEST", "MESSAGE", "ALERT"),
    message: Joi.string().min(1).max(1024).required(),
    isRead: Joi.boolean(),
  });

  return schema.validate(data, { abortEarly: false });
}

exports.notificationService = { validateNotification };
