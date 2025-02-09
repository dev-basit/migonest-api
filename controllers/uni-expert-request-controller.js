const { ResponseHandler, Constants } = require("../utils");
const { Logger } = require("../startup/logs");
const {
  uniExpertRequestRepository,
  userRepository,
  universityRepository,
  admissionRepository,
} = require("../repositories");
const { uniExpertRequestService } = require("../services");

const uniExpertRequestsFind = async (req, res) => {
  try {
    const filters = {};
    if (req.query.uniExpertId) filters.uniExpertId = req.query.uniExpertId;
    if (req.query.studentId) filters.studentId = req.query.studentId;

    Logger.info(Constants.FETCHING_DATA);

    const requests = await uniExpertRequestRepository.findUniExpertRequests(filters);
    return ResponseHandler.sendOkResponse(requests, Constants.SUCCESSFULLY_FETCED, res);
  } catch (error) {
    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

const uniExpertRequestCreate = async (req, res) => {
  try {
    const requestedPayload = {
      uniExpertId: req.body.uniExpertId,
      studentId: req.body.studentId,
      universityId: req.body.universityId,
      acceptStatus: req.body.acceptStatus,
      paymentStatus: req.body.paymentStatus,
    };

    const { error } = uniExpertRequestService.validateCreateUniExpertRequestPayload(requestedPayload);
    if (error) return ResponseHandler.sendBadResponse(error.details[0].message, res);

    const uniExpertDetails = await userRepository.findUserById(requestedPayload.uniExpertId);
    if (!uniExpertDetails) return ResponseHandler.sendNotFoundResponse(Constants.UNI_EXPERT_NOT_FOUND, res);
    if (uniExpertDetails.type !== Constants.UNI_EXPERT)
      return ResponseHandler.sendForbiddenResponse("Please send correct uni expert id.", res);

    const studentDetails = await userRepository.findUserById(requestedPayload.studentId);
    if (!studentDetails) return ResponseHandler.sendNotFoundResponse(Constants.STUDENT_NOT_FOUND, res);
    if (studentDetails.type !== Constants.STUDENT)
      return ResponseHandler.sendForbiddenResponse("Please send correct student id.", res);

    const universityDetails = await universityRepository.findUniversityById(requestedPayload.universityId);
    if (!universityDetails) return ResponseHandler.sendNotFoundResponse(Constants.UNIVERSITY_NOT_FOUND, res);

    if (universityDetails.uniExpertId.toString() !== uniExpertDetails._id.toString()) {
      return ResponseHandler.sendForbiddenResponse(
        "This uni expert cannot provide services for this university.",
        res
      );
    }

    const isAcceptRequestAlreadyExists = await uniExpertRequestService.isAcceptRequestAlreadyExists(
      requestedPayload.studentId,
      requestedPayload.universityId
    );
    if (isAcceptRequestAlreadyExists) {
      return ResponseHandler.sendForbiddenResponse("You have already requested for this university.", res);
    }

    Logger.info(Constants.PAYLOAD_IS_CORRECT);

    const newRequest = await uniExpertRequestRepository.createUniExpertRequest(requestedPayload);
    return ResponseHandler.sendCreatedResponse(newRequest, "Successfull.", res);
  } catch (error) {
    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

const uniExpertRequestUpdate = async (req, res) => {
  try {
    if (!req.params.id) return ResponseHandler.sendBadResponse(Constants.SEND_ID_IN_PARAMS, res);

    const requestExisitngDetails = await uniExpertRequestRepository.findUniExpertRequestById(req.params.id);
    if (!requestExisitngDetails)
      return ResponseHandler.sendNotFoundResponse(Constants.RESOURCE_NOT_FOUND, res);

    const { acceptStatus, paymentStatus } = req.body;

    if (acceptStatus && req.user.type !== Constants.UNI_EXPERT)
      return ResponseHandler.sendForbiddenResponse(Constants.FORBIDDEN, res);

    if (paymentStatus?.toString() && req.user.type !== Constants.STUDENT)
      return ResponseHandler.sendForbiddenResponse(Constants.FORBIDDEN, res);

    const payload = {};
    if (acceptStatus) payload.acceptStatus = acceptStatus;
    if (paymentStatus) payload.paymentStatus = paymentStatus;

    // todo wrap in transaction (if acceptStatus === "accepted")
    const updatedRequest = await uniExpertRequestRepository.updateUniExpertRequest(req.params.id, payload);
    if (!updatedRequest) return ResponseHandler.sendBadResponse(Constants.ERROR_UPDATING, res);

    if (acceptStatus && acceptStatus === "accepted") {
      Logger.info("Creating admission record for student.");
      await admissionRepository.createAdmission({ uniExpertRequestId: req.params.id });
    }

    return ResponseHandler.sendOkResponse(updatedRequest, Constants.SUCCESSFULLY_UPDATED_, res);
  } catch (error) {
    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

exports.uniExpertRequestsControllers = {
  uniExpertRequestsFind,
  uniExpertRequestCreate,
  uniExpertRequestUpdate,
};
