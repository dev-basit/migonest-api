const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi); // enable .objectId()

function validateNotification(data) {
  const schema = Joi.object({
    user: Joi.objectId().required(),
    type: Joi.string().valid("request", "message", "alert"),
    message: Joi.string().min(1).max(1000).required(),
    isRead: Joi.boolean(),
  });

  return schema.validate(data, { abortEarly: false });
}

exports.notificationService = { validateNotification };
