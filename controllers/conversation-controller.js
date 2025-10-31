const { ResponseHandler, Constants } = require("../utils");
const { Logger } = require("../startup/logs");
const {
  userRepository,
  conversationRepository,
  uniExpertRequestRepository,
  subscriptionRepository,
} = require("../repositories");
const { conversationService } = require("../services");

const conversationsFind = async (req, res) => {
  try {
    const filters = { members: { $in: req.user._id } };

    const [conversations, subscription] = await Promise.all([
      conversationRepository.findAll(filters),
      subscriptionRepository.findSubscription({ userId: req.user._id }),
    ]);

    const now = new Date();
    const hasActiveSubscription = Boolean(subscription && new Date(subscription.currentPeriodEnd) > now);

    if (hasActiveSubscription) {
      Logger.info("User has active subscription");

      const allowedConversations = conversations.map((conversation) => ({ ...conversation, allowed: true }));
      return ResponseHandler.sendOkResponse(allowedConversations, Constants.SUCCESSFULLY_FETCED, res);
    } else {
      Logger.info("User does not have active subscription");

      const paidRequests = await uniExpertRequestRepository.findUniExpertRequests({
        studentId: req.user._id,
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
        return { ...conversation, allowed: isAllowed };
      });

      return ResponseHandler.sendOkResponse(allowedConversations, Constants.SUCCESSFULLY_FETCED, res);
    }
  } catch (error) {
    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

const conversationCreate = async (req, res) => {
  try {
    const requestedPayload = req.body;
    const { error } = conversationService.validateConversationCreatePayload(requestedPayload);
    if (error) return ResponseHandler.sendBadResponse(error.details[0].message, res);

    if (requestedPayload.members[0] === requestedPayload.members[1])
      return ResponseHandler.sendBadResponse("Chat members must be two distinct users.", res);

    const membersDetails = await userRepository.findUsers({ _id: { $in: req.body.members } });
    if (!membersDetails || membersDetails.length !== 2)
      return ResponseHandler.sendNotFoundResponse(Constants.USER_NOT_FOUND, res);

    const isConversationAlreadyExists = await conversationRepository.findOne({
      members: { $all: req.body.members },
    });
    if (isConversationAlreadyExists)
      return ResponseHandler.sendConflictResponse("Conversation already exists.", res);

    Logger.info(Constants.PAYLOAD_IS_CORRECT);

    const newConversation = await conversationRepository.create(requestedPayload);
    return ResponseHandler.sendCreatedResponse(newConversation, Constants.SUCCESSFULLY_ADDED, res);
  } catch (error) {
    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

const conversationUpdate = async (req, res) => {
  try {
    const requestBody = req.body;
    requestBody.setUnreadCountsFor = { id: requestBody.setUnreadCountsFor, value: 0 };

    const updatedConversation = await conversationService.updateConversation(req.params.id, requestBody);
    return ResponseHandler.sendOkResponse(updatedConversation, Constants.SUCCESSFULLY_UPDATED_, res);
  } catch (error) {
    if (error.status && error.message) {
      return ResponseHandler.sendErrorResponse(error.message, error.status, res);
    }
    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

exports.conversationControllers = {
  conversationsFind,
  conversationCreate,
  conversationUpdate,
};
