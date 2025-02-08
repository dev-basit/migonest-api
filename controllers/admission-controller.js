const { ResponseHandler, Constants } = require("../utils");
const { Logger } = require("../startup/logs");
const { admissionRepository, uniExpertRequestRepository } = require("../repositories");
const { admissionService } = require("../services");
const { UniExpertRequestModel } = require("../models");

const admissionsFind = async (req, res) => {
  try {
    const { uniExpertId, studentId } = req.query;
    if (!uniExpertId && !studentId) return ResponseHandler.sendBadResponse(Constants.SEND_ID_IN_PARAMS, res);

    const filters = {};
    if (uniExpertId) filters.uniExpertId = uniExpertId;
    if (studentId) filters.studentId = studentId;

    Logger.info(Constants.FETCHING_DATA);

    const uniExpertRequests = (await uniExpertRequestRepository.findUniExpertRequests(filters)).map(
      (request) => request._id
    );

    const admissions = await admissionRepository.findAdmissions({ uniExpertRequestId: uniExpertRequests });

    return ResponseHandler.sendOkResponse(admissions, Constants.SUCCESSFULLY_FETCED, res);
  } catch (error) {
    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

const admissionCreate = async (req, res) => {
  try {
    const requestedPayload = {
      step: req.body.step,
      uniExpertRequestId: req.body.uniExpertRequestId,
      documents: req.body.documents,
    };

    const { error } = admissionService.validateAdmissionCreatePayload(requestedPayload);
    if (error) return ResponseHandler.sendBadResponse(error.details[0].message, res);

    const uniExpertRequest = await uniExpertRequestRepository.findUniExpertRequestById(
      requestedPayload.uniExpertRequestId
    );
    if (!uniExpertRequest)
      return ResponseHandler.sendNotFoundResponse(Constants.UNI_EXPERT_REQUEST_NOT_FOUND, res);

    Logger.info(Constants.PAYLOAD_IS_CORRECT);

    const newAdmission = await admissionRepository.createAdmission(requestedPayload);
    return ResponseHandler.sendCreatedResponse(newAdmission, Constants.SUCCESSFULLY_ADDED, res);
  } catch (error) {
    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

exports.admissionsControllers = { admissionsFind, admissionCreate };
