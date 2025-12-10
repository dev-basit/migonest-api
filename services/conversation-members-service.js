const Joi = require("joi");
const { Constants } = require("../utils");
const { conversationMembersRepository, conversationRepository, userRepository } = require("../repositories");

function validateConversationMemberCreatePayload(data) {
  const schema = Joi.object({
    conversationId: Joi.string().guid({ version: "uuidv4" }).required().messages({
      "string.guid": "`conversationId` must be a valid id.",
    }),
    userId: Joi.string().guid({ version: "uuidv4" }).required().messages({
      "string.guid": "`userId` must be a valid id.",
    }),
    unreadCount: Joi.number().integer().min(0).optional(),
  });

  return schema.validate(data);
}

function validateConversationMemberUpdatePayload(data) {
  const schema = Joi.object({
    unreadCount: Joi.number().integer().min(0).optional(),
  });

  return schema.validate(data);
}

exports.conversationMembersService = {
  validateConversationMemberCreatePayload,
  validateConversationMemberUpdatePayload,
};
