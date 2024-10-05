const Joi = require("joi");

exports.addMongooseObjectIdValidation = function () {
  Joi.objectId = require("joi-objectid")(Joi);
};
