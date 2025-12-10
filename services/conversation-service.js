const Joi = require("joi");
const {
  conversationRepository,
  subscriptionRepository,
  uniExpertRequestRepository,
  conversationMembersRepository,
} = require("../repositories");
const { Logger } = require("../startup/logs");

function validateConversationCreatePayload(data) {
  const schema = Joi.object({
    members: Joi.array()
      .items(
        Joi.string().guid({ version: "uuidv4" }).required().messages({
          "string.guid": "`members` entries must be valid UUID",
        })
      )
      .length(2)
      .required()
      .messages({
        "array.base": "`members` must be an array",
        "array.length": "`members` must contain exactly two user IDs",
      }),
    lastMessage: Joi.string().guid({ version: "uuidv4" }),
  });

  return schema.validate(data);
}

// TODO: cache this function value when using redis
const conversationsAllowed = async (userId, conversationId) => {
  try {
    const filters = { members: { some: { userId } } };
    const subscription = await subscriptionRepository.findSubscription({ userId });

    const now = new Date();
    const hasActiveSubscription = Boolean(subscription && new Date(subscription.currentPeriodEnd) > now);

    if (hasActiveSubscription) {
      Logger.info("User has active subscription");

      return true;
    } else {
      Logger.info("User does not have active subscription");

      const conversations = await conversationRepository.findAll(filters);
      const paidRequests = await uniExpertRequestRepository.findUniExpertRequests({
        studentId: userId,
        paymentStatus: true,
      });
      let allowedUniExpertIds = new Set();
      if (Array.isArray(paidRequests) && paidRequests.length > 0) {
        allowedUniExpertIds = new Set(paidRequests.map((request) => request.uniExpertId.id.toString()));
      }

      const allowedConversations = conversations.map((conversation) => {
        const memberIds = (conversation.members || []).map((member) =>
          member && member.id ? member.id.toString() : member?.toString()
        );
        const isAllowed = memberIds.some((id) => allowedUniExpertIds.has(id));
        return { id: conversation.id.toString(), allowed: isAllowed };
      });

      return allowedConversations.some(
        (conversation) => conversation.allowed && conversation.id === conversationId
      );
    }
  } catch (error) {
    throw error;
  }
};

const isConvAlreadyExists = async (members) => {
  try {
    const conversationMembers = await conversationMembersRepository.findAll({ userId: { in: members } });
    const conversationIds = new Set(conversationMembers.map((m) => m.conversationId));
    const commonConversationIds = [...conversationIds].filter((id) => conversationIds.has(id));
    return commonConversationIds.length > 0;
  } catch (error) {
    throw error;
  }
};

exports.conversationService = {
  validateConversationCreatePayload,
  conversationsAllowed,
  isConvAlreadyExists,
};
