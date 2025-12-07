const Joi = require("joi");

function validateNewPostPayload(data) {
  const schema = Joi.object({
    authorId: Joi.string().guid({ version: "uuidv4" }).required(),
    content: Joi.string().min(1).max(1024).required(),
    picture: Joi.string().optional().allow(""),
  });

  return schema.validate(data);
}

exports.postService = { validateNewPostPayload };
