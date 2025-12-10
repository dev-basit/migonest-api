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

const updateConversationMember = async (id, updatedData) => {
  if (!id) throw { status: 400, message: Constants.SEND_ID_IN_PARAMS };

  const existingMember = await conversationMembersRepository.findById(id);
  if (!existingMember) throw { status: 404, message: Constants.RESOURCE_NOT_FOUND };

  const updatedMember = await conversationMembersRepository.update(id, updatedData);
  if (!updatedMember) throw { status: 400, message: Constants.ERROR_UPDATING };

  return updatedMember;
};

exports.conversationMembersService = {
  validateConversationMemberCreatePayload,
  validateConversationMemberUpdatePayload,
  updateConversationMember,
};
