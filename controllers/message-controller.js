const { ResponseHandler, Constants } = require("../utils");
const { Logger } = require("../startup/logs");
const {
  messageRepository,
  conversationRepository,
  conversationMembersRepository,
} = require("../repositories");
const { messageService, conversationService } = require("../services");

const messageFind = async (req, res) => {
  try {
    let conversationId = req.params.conversationId;
    if (!conversationId)
      return ResponseHandler.sendBadResponse("Please send conversation id in params.", res);

    const isConversationExist = await conversationRepository.findById(conversationId);
    if (!isConversationExist)
      return ResponseHandler.sendNotFoundResponse(Constants.CONVERSATION_NOT_FOUND, res);

    Logger.info(Constants.FETCHING_DATA);

    const messages = await messageRepository.findAll({ conversationId });
    return ResponseHandler.sendOkResponse(messages, Constants.SUCCESSFULLY_FETCED, res);
  } catch (error) {
    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

const messageCreate = async (req, res) => {
  try {
    const requestedPayload = {
      message: req.body.message,
      senderId: req.body.senderId,
      conversationId: req.body.conversationId,
    };
    const { error } = messageService.validateMessage(requestedPayload);
    if (error) return ResponseHandler.sendBadResponse(error.details[0].message, res);

    const isCurrentUserStudent = req.user.type === Constants.STUDENT;
    if (isCurrentUserStudent) {
      const conversationAllowed = await conversationService.conversationsAllowed(
        req.user.id,
        req.body.conversationId
      );
      if (!conversationAllowed)
        return ResponseHandler.sendForbiddenResponse("You are not allowed to send messages", res);
    }

    const conversation = await conversationRepository.findById(requestedPayload.conversationId);
    if (!conversation) return ResponseHandler.sendNotFoundResponse(Constants.CONVERSATION_NOT_FOUND, res);

    const isSenderMemberOfConversation = conversation.members
      .map((member) => member.user.id)
      .includes(requestedPayload.senderId);
    if (!isSenderMemberOfConversation)
      return ResponseHandler.sendForbiddenResponse("Sender is not a member of this conversation", res);

    Logger.info(Constants.PAYLOAD_IS_CORRECT);

    // TODO: wrap in transaction (message creation, lastMessageId update, unread count update)
    const newMessage = await messageRepository.create(requestedPayload);
    await conversationRepository.update(requestedPayload.conversationId, { lastMessageId: newMessage.id });

    const receiver = conversation.members.find((mem) => mem.user.id !== requestedPayload.senderId).user.id;
    // increment unread count for receiver
    await conversationMembersRepository.update(
      { conversationId_userId: { conversationId: requestedPayload.conversationId, userId: receiver } },
      { unreadCount: { increment: 1 } }
    );

    return ResponseHandler.sendOkResponse(newMessage, Constants.SUCCESSFULLY_ADDED, res);
  } catch (error) {
    if (error.status && error.message) {
      return ResponseHandler.sendErrorResponse(error.message, error.status, res);
    }

    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

exports.messageControllers = {
  messageFind,
  messageCreate,
};
