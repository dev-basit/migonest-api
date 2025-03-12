const { ResponseHandler, Constants, sendContactUsMail } = require("../utils");
const { Logger } = require("../startup/logs");
const { contactUsService } = require("../services");

const sendMessage = async (req, res) => {
  try {
    const requestedPayload = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      message: req.body.message,
    };

    const { error } = contactUsService.validateContactUsPayload(requestedPayload);
    if (error) return ResponseHandler.sendBadResponse(error.details[0].message, res);

    Logger.info(Constants.PAYLOAD_IS_CORRECT);
    Logger.info("Sending email");

    await sendContactUsMail(requestedPayload);

    return ResponseHandler.sendOkResponse(null, "Successfully sent your message", res);
  } catch (error) {
    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

exports.contactUsControllers = { sendMessage };
