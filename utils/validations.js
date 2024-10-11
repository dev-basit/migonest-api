const Joi = require("joi");

function userCreate(user) {
  const schema = Joi.object({
    firstName: Joi.string().min(3).max(128).required(),
    lastName: Joi.string().min(3).max(128).required(),
    email: Joi.string().min(3).max(128).required().email(),
    password: Joi.string().min(4).max(1024).required(),
    date: Joi.string().min(9).max(11).required(),
    gender: Joi.string().valid("male", "female", "other").required(),
    type: Joi.string().valid("student", "uni-expert", "super-admin").required(),
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
