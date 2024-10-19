const Joi = require("joi");
const { Constants } = require("./constants");

function userCreate(user) {
  const schema = Joi.object({
    userName: Joi.string().min(3).max(128).required(),
    firstName: Joi.string().min(3).max(128).required(),
    lastName: Joi.string().min(3).max(128).required(),
    email: Joi.string().min(3).max(128).required().email(),
    password: Joi.string().min(4).max(1024).required(),
    profilePicture: Joi.string().min(3).max(2048).required(),
    date: Joi.string().min(9).max(11).required(),
    gender: Joi.string().valid("male", "female", "other").required(),
    type: Joi.string().valid(Constants.STUDENT, Constants.UNI_EXPERT, Constants.SUPER_ADMIN).required(),
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

function emailVerification(req) {
  const schema = Joi.object({
    email: Joi.string().min(3).max(128).required().email(),
    code: Joi.string().length(6).required(),
  });

  return schema.validate(req);
}

exports.validatePayload = { userCreate, userLogin, emailVerification };
