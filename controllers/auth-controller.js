const { validatePayload, ResponseHandler, Response, Constants } = require("../utils");
const { Logger } = require("../startup/logs");
const { authService } = require("../services");
const { userRepository } = require("../repositories");

// TODO: If user is not verified, dont let him to log in
const userLogin = async (req, res) => {
  try {
    const { error } = validatePayload.userLogin(req.body);
    if (error) return ResponseHandler.sendBadResponse(error.details[0].message, res);

    Logger.info(Constants.PAYLOAD_IS_CORRECT);
    Logger.info(Constants.FETCHING_DATA);

    let user = await userRepository.findUser({ email: req.body.email });
    if (!user) return ResponseHandler.sendUnauthorizedResponse(Constants.INVALID_EMAIL_PASSWORD, res);

    const validPassword = await authService.verifyPassword(req.body.password, user.password);
    if (!validPassword)
      return ResponseHandler.sendUnauthorizedResponse(Constants.INVALID_EMAIL_PASSWORD, res);

    const token = user.generateAuthToken();
    Logger.info(Constants.SUCCESSFULLY_JWT_CREATED);

    return res
      .status(Constants.HTTP_STATUS_CODES.OK)
      .send(
        new Response(
          { jwt: token },
          Constants.HTTP_STATUS_CODES.OK,
          Constants.SUCCESSFULLY_LOGGED_IN,
          Constants.SUCCESS
        )
      );
  } catch (error) {
    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { error } = validatePayload.emailVerification(req.body);
    if (error) return ResponseHandler.sendBadResponse(error.details[0].message, res);

    Logger.info(Constants.PAYLOAD_IS_CORRECT);

    let user = await userRepository.findUser({ email: req.body.email });
    if (!user) return ResponseHandler.sendNotFoundResponse(Constants.USER_NOT_FOUND, res);

    if (user.isVerified) return ResponseHandler.sendBadResponse(Constants.EMAIL_ALREADY_VERIFIED, res);

    Logger.info("Matching token.");

    if (user.emailVerificationCode !== req.body.code)
      return ResponseHandler.sendBadResponse(Constants.INVALID_VERIFICATION_CODE, res);

    const userUpdatedDetails = { isVerified: true, emailVerificationCode: "" };
    const updatedUser = await userRepository.updateUser(user._id, userUpdatedDetails);
    if (!updatedUser) return ResponseHandler.sendBadResponse(Constants.ERROR_UPDATING, res);

    return ResponseHandler.sendOkResponse(null, Constants.SUCCESSFULLY_VERIFIED_ACCOUNT, res);
  } catch (error) {
    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

exports.authControllers = { userLogin, verifyEmail };
