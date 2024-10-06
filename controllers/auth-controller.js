const { validatePayload, ResponseHandler, Response, Constants } = require("../utils");
const { Logger } = require("../startup/logs");
const { authService } = require("../services");
const { userRepository } = require("../repositories");

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

exports.authControllers = { userLogin };
