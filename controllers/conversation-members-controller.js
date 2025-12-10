const { ResponseHandler, Constants } = require("../utils");
const { Logger } = require("../startup/logs");
const { conversationMembersRepository, conversationRepository, userRepository } = require("../repositories");
const { conversationMembersService } = require("../services");

const conversationMembersFind = async (req, res) => {
  try {
    const filters = {};
    if (req.query.conversationId) filters.conversationId = req.query.conversationId;
    if (req.query.userId) filters.userId = req.query.userId;

    Logger.info(Constants.FETCHING_DATA);

    const conversationMembers = await conversationMembersRepository.findAll(filters);
    return ResponseHandler.sendOkResponse(conversationMembers, Constants.SUCCESSFULLY_FETCED, res);
  } catch (error) {
    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

const conversationMemberCreate = async (req, res) => {
  try {
    const requestedPayload = req.body;
    const { error } = conversationMembersService.validateConversationMemberCreatePayload(requestedPayload);
    if (error) return ResponseHandler.sendBadResponse(error.details[0].message, res);

    const conversation = await conversationRepository.findById(requestedPayload.conversationId);
    if (!conversation) return ResponseHandler.sendNotFoundResponse(Constants.CONVERSATION_NOT_FOUND, res);

    const user = await userRepository.findUserById(requestedPayload.userId);
    if (!user) return ResponseHandler.sendNotFoundResponse(Constants.USER_NOT_FOUND, res);

    const isAlreadyMemberOfConversation = await conversationMembersRepository.findUnique({
      conversationId_userId: {
        conversationId: requestedPayload.conversationId,
        userId: requestedPayload.userId,
      },
    });
    if (isAlreadyMemberOfConversation)
      return ResponseHandler.sendConflictResponse("You are already a member of this conversation.", res);

    Logger.info(Constants.PAYLOAD_IS_CORRECT);

    const newConversationMember = await conversationMembersRepository.create(requestedPayload);
    return ResponseHandler.sendCreatedResponse(newConversationMember, Constants.SUCCESSFULLY_ADDED, res);
  } catch (error) {
    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

const conversationMemberUpdate = async (req, res) => {
  try {
    if (!req.params.id) return ResponseHandler.sendBadResponse(Constants.SEND_ID_IN_PARAMS, res);

    const requestedPayload = req.body;
    const { error } = conversationMembersService.validateConversationMemberUpdatePayload(requestedPayload);
    if (error) return ResponseHandler.sendBadResponse(error.details[0].message, res);

    const updatedMember = await conversationMembersService.updateConversationMember(
      req.params.id,
      requestedPayload
    );
    return ResponseHandler.sendOkResponse(updatedMember, Constants.SUCCESSFULLY_UPDATED_, res);
  } catch (error) {
    if (error.status && error.message) {
      return ResponseHandler.sendErrorResponse(error.message, error.status, res);
    }
    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

exports.conversationMembersControllers = {
  conversationMembersFind,
  conversationMemberCreate,
  conversationMemberUpdate,
};
