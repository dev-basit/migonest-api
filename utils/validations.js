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
    documents: Joi.array()
      .items(Joi.object({ label: Joi.string().required(), url: Joi.string().uri().required() }))
      .default([]),
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

function passwordUpdate(user) {
  const schema = Joi.object({
    currentPassword: Joi.string().min(4).max(1024).required(),
    newPassword: Joi.string().min(4).max(1024).required(),
  });

  return schema.validate(user);
}

function forgotPasswordVerify(body) {
  const schema = Joi.object({
    email: Joi.string().min(3).max(128).required().email(),
    otp: Joi.string().length(6).required(),
    newPassword: Joi.string().min(4).max(1024).required(),
  });

  return schema.validate(body);
}

exports.validatePayload = {
  userCreate,
  userLogin,
  emailVerification,
  passwordUpdate,
  forgotPasswordVerify,
};
