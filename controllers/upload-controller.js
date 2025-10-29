const { ResponseHandler, Constants } = require("../utils");

const upload = async (req, res) => {
  try {
    return ResponseHandler.sendOkResponse(req.file.path, Constants.SUCCESSFULLY_UPLOADED, res);
  } catch (error) {
    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

exports.uploadControllers = { upload };
