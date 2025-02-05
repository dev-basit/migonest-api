const { ResponseHandler, Constants } = require("../utils");
const { Logger } = require("../startup/logs");
const { uniExpertRequestRepository, userRepository, universityRepository } = require("../repositories");
const { uniExpertRequestService } = require("../services");

const uniExpertRequestsFind = async (req, res) => {
  try {
    Logger.info(Constants.FETCHING_DATA);
    const filters = {};
    if (req.query.uniExpertId) filters.uniExpertId = req.query.uniExpertId;
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

    if (universityDetails.uniExpertId.toString() !== uniExpertDetails._id.toString())
      return ResponseHandler.sendForbiddenResponse(
        "This uni expert cannot provide services for this university.",
        res
      );

    Logger.info(Constants.PAYLOAD_IS_CORRECT);

    const newRequest = await uniExpertRequestRepository.createUniExpertRequest(requestedPayload);
    return ResponseHandler.sendCreatedResponse(newRequest, "Successfull.", res);
  } catch (error) {
    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

exports.uniExpertRequestsControllers = { uniExpertRequestsFind, uniExpertRequestCreate };
