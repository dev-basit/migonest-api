const Joi = require("joi");
const { Constants } = require("../utils");
const {
  conversationRepository,
  subscriptionRepository,
  uniExpertRequestRepository,
} = require("../repositories");
const { Logger } = require("../startup/logs");

function validateConversationCreatePayload(data) {
  const schema = Joi.object({
    members: Joi.array()
      .items(
        Joi.string().length(24).required().messages({
          "string.length": "`members` entries must be 24 characters long",
          "string.pattern.name": "`members` entries must be valid ObjectId",
        })
      )
      .length(2)
      .required()
      .messages({
        "array.base": "`members` must be an array",
        "array.length": "`members` must contain exactly two user IDs",
      }),
    lastMessage: Joi.objectId(),
    unreadCounts: Joi.object().pattern(Joi.string(), Joi.number().min(0)),
  });

  return schema.validate(data);
}

const updateConversation = async (conversationId, updatedData) => {
  if (!conversationId) throw { status: 400, message: Constants.SEND_ID_IN_PARAMS };

  const existingConversation = await conversationRepository.findById(conversationId);
  if (!existingConversation) throw { status: 404, message: Constants.RESOURCE_NOT_FOUND };

  const { lastMessage, setUnreadCountsFor } = updatedData;
  const payload = {};

  if (lastMessage) {
    payload.lastMessage = lastMessage;
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
    const hasActiveSubscription = Boolean(
      subscription && subscription.status === "active" && new Date(subscription.currentPeriodEnd) > now
    );

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
        allowedUniExpertIds = new Set(paidRequests.map((request) => request.uniExpertId._id.toString()));
      }

      const allowedConversations = conversations.map((conversation) => {
        const memberIds = (conversation.members || []).map((member) =>
          member && member._id ? member._id.toString() : member?.toString()
        );
        const isAllowed = memberIds.some((id) => allowedUniExpertIds.has(id));
        return { id: conversation._id.toString(), allowed: isAllowed };
      });

      return allowedConversations.some(
        (conversation) => conversation.allowed && conversation.id === conversationId
      );
    }
  } catch (error) {
    throw error;
  }
};

exports.conversationService = { validateConversationCreatePayload, updateConversation, conversationsAllowed };
