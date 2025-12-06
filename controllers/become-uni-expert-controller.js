const { ResponseHandler, Constants } = require("../utils");
const { Logger } = require("../startup/logs");
const { becomeUniExpertService } = require("../services");
const { becomeUniExpertsRepository, userRepository } = require("../repositories");

const becomeUniExpertsFind = async (req, res) => {
  try {
    const filters = {};
    if (req.query.studentId) filters.studentId = req.query.studentId;

    Logger.info(Constants.FETCHING_DATA);

    const requests = await becomeUniExpertsRepository.findBecomeUniExperts(filters);
    return ResponseHandler.sendOkResponse(requests, Constants.SUCCESSFULLY_FETCED, res);
  } catch (error) {
    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

const becomeUniExpertCreate = async (req, res) => {
  try {
    const requestedPayload = { studentId: req.body.studentId };
    const { error } = becomeUniExpertService.validateBecomeUniExpertPayload(requestedPayload);
    if (error) return ResponseHandler.sendBadResponse(error.details[0].message, res);

    const studentDetails = await userRepository.findUserById(requestedPayload.studentId);
    if (!studentDetails) return ResponseHandler.sendNotFoundResponse(Constants.STUDENT_NOT_FOUND, res);
    if (studentDetails.type !== Constants.STUDENT)
      return ResponseHandler.sendForbiddenResponse("Only students can request to become uni expert.", res);

    const isAcceptRequestAlreadyExists = await becomeUniExpertService.isBecomeUniExpertRequestExists(
      requestedPayload.studentId
    );
    if (isAcceptRequestAlreadyExists) {
      return ResponseHandler.sendBadResponse("You have already requested to become uni expert.", res);
    }

    Logger.info(Constants.PAYLOAD_IS_CORRECT);

    const newRequest = await becomeUniExpertsRepository.createBecomeUniExperts(requestedPayload);
    return ResponseHandler.sendCreatedResponse(
      newRequest,
      "Successfully requested to become uni expert.",
      res
    );
  } catch (error) {
    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

const becomeUniExpertUpdate = async (req, res) => {
  try {
    const becomeUnieExpertId = req.params.id;
    if (!becomeUnieExpertId) return ResponseHandler.sendBadResponse(Constants.SEND_ID_IN_PARAMS, res);

    const existingRequestDetails = await becomeUniExpertsRepository.findBecomeUniExpertsById(
      becomeUnieExpertId
    );
    if (!existingRequestDetails)
      return ResponseHandler.sendNotFoundResponse(Constants.RESOURCE_NOT_FOUND, res);

    const { acceptStatus } = req.body;
    if (!acceptStatus) return ResponseHandler.sendBadResponse("Please send status in payload.", res);

    if (acceptStatus && req.user.type !== Constants.ADMIN)
      return ResponseHandler.sendForbiddenResponse(Constants.FORBIDDEN_, res);

    const payload = { acceptStatus };

    // todo wrap in transaction
    const updatedRequest = await becomeUniExpertsRepository.updateBecomeUniExperts(
      becomeUnieExpertId,
      payload
    );
    if (!updatedRequest) return ResponseHandler.sendBadResponse(Constants.ERROR_UPDATING, res);

    if (acceptStatus && acceptStatus === Constants.ACCEPT_STATUS) {
      Logger.info("Updating user type to uni expert.");
      await userRepository.updateUser(existingRequestDetails.studentId.id, { type: Constants.UNI_EXPERT });
    }

    return ResponseHandler.sendOkResponse(updatedRequest, Constants.SUCCESSFULLY_UPDATED_, res);
  } catch (error) {
    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

exports.becomeUniExpertControllers = {
  becomeUniExpertsFind,
  becomeUniExpertCreate,
  becomeUniExpertUpdate,
};
