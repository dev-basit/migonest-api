const { ResponseHandler, Constants, Utils } = require("../utils");
const { Logger } = require("../startup/logs");
const { universityRepository, userRepository } = require("../repositories");
const { universityService } = require("../services");

const universitiesFind = async (req, res) => {
  try {
    Logger.info(Constants.FETCHING_DATA);

    const filters = {};
    if (req.query.name) filters.name = { $regex: req.query.name, $options: "i" };
    if (req.query.uniExpertId) filters.uniExpertId = req.query.uniExpertId;

    const { pageNo, pageSize, skip } = req.pagination;

    const { universities, count } = await universityRepository.findUniversities(filters, { skip, pageSize });
    return ResponseHandler.sendOkResponse(
      { universities, pagination: { count, pageNo, pageSize, totalPages: Math.ceil(count / pageSize) } },
      Constants.SUCCESSFULLY_FETCED,
      res
    );
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

const universityUpdate = async (req, res) => {
  try {
    const universityId = req.params.id;
    if (!universityId) return ResponseHandler.sendBadResponse(Constants.SEND_ID_IN_PARAMS, res);

    const universityExisitngDetails = await universityRepository.findUniversityById(universityId);
    if (!universityExisitngDetails)
      return ResponseHandler.sendNotFoundResponse(Constants.RESOURCE_NOT_FOUND, res);

    const requestedPayload = {
      name: req.body.name,
      requirements: req.body.requirements,
      deadline: req.body.deadline,
      tuitionFee: req.body.tuitionFee,
      applicationFee: req.body.applicationFee,
      documents: req.body.documents,
      uniExpertId: req.body.uniExpertId,
    };

    const { error } = universityService.validateUniversityCreatePayload(requestedPayload);
    if (error) return ResponseHandler.sendBadResponse(error.details[0].message, res);

    const uniExpertDetails = await userRepository.findUserById(requestedPayload.uniExpertId);
    if (!uniExpertDetails) return ResponseHandler.sendNotFoundResponse(Constants.UNI_EXPERT_NOT_FOUND, res);
    if (uniExpertDetails.type !== Constants.UNI_EXPERT)
      return ResponseHandler.sendForbiddenResponse(Constants.FORBIDDEN, res);

    Logger.info(Constants.PAYLOAD_IS_CORRECT);

    const updatedUniversity = await universityRepository.updateUniversity(universityId, requestedPayload);
    if (!updatedUniversity) return ResponseHandler.sendBadResponse(Constants.ERROR_UPDATING, res);

    return ResponseHandler.sendOkResponse(updatedUniversity, Constants.SUCCESSFULLY_UPDATED_, res);
  } catch (error) {
    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

exports.universitiesControllers = { universitiesFind, universityCreate, universityUpdate };
