const { ResponseHandler, Constants, Utils } = require("../utils");
const { Logger } = require("../startup/logs");
const { universityRepository, userRepository } = require("../repositories");
const { universityService } = require("../services");

const universitiesFind = async (req, res) => {
  try {
    Logger.info(Constants.FETCHING_DATA);

    const filters = {};
    if (req.query.uniExpertId) filters.uniExpertId = req.query.uniExpertId;
    const universities = await universityRepository.findUniversities(filters);

    return ResponseHandler.sendOkResponse(universities, Constants.SUCCESSFULLY_FETCED, res);
  } catch (error) {
    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

const universityCreate = async (req, res) => {
  try {
    const requestedPayload = {
      name: req.body.name,
      requirements: req.body.requirements,
      deadline: req.body.deadline,
      tuitionFee: req.body.tuitionFee,
      applicationFee: req.body.applicationFee,
      documents: req.body.documents,
      uniExpertId: req.body.uniExpertId,
      location: req.body.location,
    };

    const { error } = universityService.validateUniversityCreatePayload(requestedPayload);
    if (error) return ResponseHandler.sendBadResponse(error.details[0].message, res);

    const uniExpertDetails = await userRepository.findUserById(requestedPayload.uniExpertId);
    if (!uniExpertDetails) return ResponseHandler.sendNotFoundResponse(Constants.UNI_EXPERT_NOT_FOUND, res);
    if (uniExpertDetails.type !== Constants.UNI_EXPERT)
      return ResponseHandler.sendForbiddenResponse(Constants.FORBIDDEN, res);

    Logger.info(Constants.PAYLOAD_IS_CORRECT);

    const newUniversity = await universityRepository.createUniversity(requestedPayload);
    return ResponseHandler.sendCreatedResponse(newUniversity, Constants.SUCCESSFULLY_ADDED, res);
  } catch (error) {
    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

exports.universitiesControllers = { universitiesFind, universityCreate };
