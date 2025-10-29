const { ResponseHandler, Constants } = require("../utils");
const { uploadStreamToCloudinary } = require("../utils/cloudinary");

const upload = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return ResponseHandler.sendBadResponse("NO_FILE_PROVIDED", res);
    }

    const isPDF = file.mimetype === "application/pdf";
    const result = await uploadStreamToCloudinary(file.buffer, file.originalname, isPDF);
    return ResponseHandler.sendOkResponse(result.secure_url, Constants.SUCCESSFULLY_UPLOADED, res);
  } catch (error) {
    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

exports.uploadControllers = { upload };
