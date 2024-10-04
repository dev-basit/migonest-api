const Joi = require("joi");

function userCreate(user) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(128).required(),
    email: Joi.string().min(3).max(128).required().email(),
    password: Joi.string().min(4).max(1024).required(),
    phoneNo: Joi.string().min(3).max(20).required(),
    type: Joi.string().valid("admin", "user").required(),
  });

  return schema.validate(user);
}

function userLogin(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(4).max(255).required(),
  });

  return schema.validate(req);
}

exports.validatePayload = { userCreate, userLogin };
