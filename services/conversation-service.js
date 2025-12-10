const Joi = require("joi");
const { Constants } = require("../utils");
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

const updateConversation = async (conversationId, updatedData) => {
  if (!conversationId) throw { status: 400, message: Constants.SEND_ID_IN_PARAMS };

  const existingConversation = await conversationRepository.findById(conversationId);
  if (!existingConversation) throw { status: 404, message: Constants.RESOURCE_NOT_FOUND };

  const { lastMessageId, setUnreadCountsFor } = updatedData;
  const payload = {};

  if (lastMessageId) {
    payload.lastMessageId = lastMessageId;
  }

  if (setUnreadCountsFor) {
    payload.unreadCounts = existingConversation.unreadCounts;
    payload.unreadCounts.set(setUnreadCountsFor.id, setUnreadCountsFor.value);
  }

  if (Object.keys(payload).length === 0) throw { status: 400, message: "No valid fields to update." };

  const updatedConversation = await conversationRepository.update(conversationId, payload);
  if (!updatedConversation) throw { status: 400, message: Constants.ERROR_UPDATING };

  return updatedConversation;
};

// TODO: cache this function value when using redis
const conversationsAllowed = async (userId, conversationId) => {
  try {
    const filters = { members: { $in: userId } };
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
  updateConversation,
  conversationsAllowed,
  isConvAlreadyExists,
};
