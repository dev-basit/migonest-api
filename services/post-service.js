const Joi = require("joi");

function validateNewPostPayload(data) {
  const schema = Joi.object({
    author: Joi.string().length(24).required(),
    content: Joi.string().min(1).max(1024).required(),
    picture: Joi.string().min(1).max(1024),
  });

  return schema.validate(data);
}

exports.postService = { validateNewPostPayload };
