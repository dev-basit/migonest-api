const { ResponseHandler, Constants } = require("../utils");
const { Logger } = require("../startup/logs");
const { documentRepository } = require("../repositories");
const { documentService } = require("../services");

const documentsFind = async (req, res) => {
  try {
    const { userId, universityId, admissionId } = req.query;

    const filters = {};
    if (userId) filters.userId = userId;
    if (universityId) filters.universityId = universityId;
    if (admissionId) filters.admissionId = admissionId;

    if (!userId && !universityId && !admissionId) filters.userId = req.user.id;

    Logger.info(Constants.FETCHING_DATA);

    const documents = await documentRepository.findDocuments(filters);

    return ResponseHandler.sendOkResponse(documents, Constants.SUCCESSFULLY_FETCED, res);
  } catch (error) {
    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

const documentCreate = async (req, res) => {
  try {
    const requestedPayload = { label: req.body.label, url: req.body.url };

    if (req.body.userId) requestedPayload.userId = req.body.userId;
    if (req.body.universityId) requestedPayload.universityId = req.body.universityId;
    if (req.body.admissionId) requestedPayload.admissionId = req.body.admissionId;

    if (!req.body.userId && !req.body.universityId && !req.body.admissionId)
      requestedPayload.userId = req.user.id;

    const { error } = documentService.validateDocumentPayload(requestedPayload);
    if (error) return ResponseHandler.sendBadResponse(error.details[0].message, res);

    Logger.info(Constants.PAYLOAD_IS_CORRECT);

    const newDocument = await documentRepository.createDocument(requestedPayload);
    return ResponseHandler.sendCreatedResponse(newDocument, Constants.SUCCESSFULLY_ADDED, res);
  } catch (error) {
    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

const documentUpdate = async (req, res) => {
  try {
    const documentId = req.params.id;
    if (!documentId) return ResponseHandler.sendBadResponse(Constants.SEND_ID_IN_PARAMS, res);

    const documentExistingDetails = await documentRepository.findDocumentById(documentId);
    if (!documentExistingDetails)
      return ResponseHandler.sendNotFoundResponse(Constants.RESOURCE_NOT_FOUND, res);

    const { error } = documentService.validateDocumentPayload(req.body);
    if (error) return ResponseHandler.sendBadResponse(error.details[0].message, res);

    const updatedDocument = await documentRepository.updateDocument(documentId, req.body);
    if (!updatedDocument) return ResponseHandler.sendBadResponse(Constants.ERROR_UPDATING, res);

    return ResponseHandler.sendOkResponse(updatedDocument, Constants.SUCCESSFULLY_UPDATED, res);
  } catch (error) {
    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

const documentDelete = async (req, res) => {
  try {
    const documentId = req.params.id;
    if (!documentId) return ResponseHandler.sendBadResponse(Constants.SEND_ID_IN_PARAMS, res);

    const documentExistingDetails = await documentRepository.findDocumentById(documentId);
    if (!documentExistingDetails)
      return ResponseHandler.sendNotFoundResponse(Constants.RESOURCE_NOT_FOUND, res);

    const deletedDocument = await documentRepository.deleteDocument(documentId);
    if (!deletedDocument) return ResponseHandler.sendBadResponse(Constants.ERROR_DELETING, res);

    return ResponseHandler.sendOkResponse(deletedDocument, Constants.SUCCESSFULLY_DELETED, res);
  } catch (error) {
    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

exports.documentsControllers = { documentsFind, documentCreate, documentUpdate, documentDelete };
