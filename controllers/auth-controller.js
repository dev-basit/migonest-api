const bcrypt = require("bcrypt");
const { validatePayload, ResponseHandler, Response, Constants, Utils, sendEmail, html } = require("../utils");
const { Logger } = require("../startup/logs");
const { authService } = require("../services");
const { userRepository } = require("../repositories");

const userLogin = async (req, res) => {
  try {
    const { error } = validatePayload.userLogin(req.body);
    if (error) return ResponseHandler.sendBadResponse(error.details[0].message, res);

    Logger.info(Constants.PAYLOAD_IS_CORRECT);
    Logger.info(Constants.FETCHING_DATA);

    let user = await userRepository.findUserWithPassword({ email: req.body.email });
    if (!user) return ResponseHandler.sendUnauthorizedResponse(Constants.INVALID_EMAIL_PASSWORD, res);

    const validPassword = await authService.verifyPassword(req.body.password, user.password);
    if (!validPassword)
      return ResponseHandler.sendUnauthorizedResponse(Constants.INVALID_EMAIL_PASSWORD, res);

    // generate new code, send code in email and return 403 response
    if (!user.isVerified) {
      user.emailVerificationCode = Utils.generateCode(6);
      await userRepository.updateUser(user._id, user);
      await sendEmail({ receiver: user.email, text: html.verificationEmail(user.emailVerificationCode) });

      return ResponseHandler.sendForbiddenResponse("Your email is not verified yet.", res);
    }

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

    // return ResponseHandler.sendOkResponse(null, Constants.SUCCESSFULLY_VERIFIED_ACCOUNT, res);
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

// TODO: Improvements
// Send password reset link via email
// Add 2FA for password change confirmation
// Log user out from all devices after a password change
const passwordUpdate = async (req, res) => {
  try {
    const { error } = validatePayload.passwordUpdate(req.body);
    if (error) return ResponseHandler.sendBadResponse(error.details[0].message, res);

    Logger.info(Constants.PAYLOAD_IS_CORRECT);

    let user = await userRepository.findUserWithPassword({ email: req.user.email });
    if (!user) return ResponseHandler.sendNotFoundResponse(Constants.USER_NOT_FOUND, res);

    const isCurrentPasswordValid = await authService.verifyPassword(req.body.currentPassword, user.password);
    if (!isCurrentPasswordValid)
      return ResponseHandler.sendUnauthorizedResponse(Constants.INVALID_CURRENT_PASSWORD, res);

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.newPassword, salt);

    const updatedUser = await userRepository.updateUser(req.user._id, user);
    if (!updatedUser) return ResponseHandler.sendBadResponse(Constants.ERROR_UPDATING, res);

    // dont send user password to the consumer
    updatedUser.password = null;

    return ResponseHandler.sendOkResponse(updatedUser, Constants.SUCCESSFULLY_UPDATED_, res);
  } catch (error) {
    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

exports.authControllers = { userLogin, verifyEmail, passwordUpdate };

// TODO: logout of users after password change success
const requestForgotPasswordOTP = async (req, res) => {
  try {
    const email = req.params.email;
    if (!email) return ResponseHandler.sendBadResponse(Constants.EMAIL_REQUIRED, res);

    let user = await userRepository.findUserWithPassword({ email });
    if (!user) return ResponseHandler.sendNotFoundResponse(Constants.USER_NOT_FOUND, res);

    const now = new Date();
    const isOtpExpired =
      user.fotgotPasswordOtp && user.fotgotPasswordOtpExpiry && new Date(user.fotgotPasswordOtpExpiry) > now;

    if (!isOtpExpired) {
      Logger.info("Generating new OTP.");

      const otp = Utils.generateCode(6);
      const salt = await bcrypt.genSalt(10);
      const hashedOtp = await bcrypt.hash(String(otp), salt);

      user = await userRepository.updateUser(user._id, {
        fotgotPasswordOtp: hashedOtp,
        fotgotPasswordOtpExpiry: new Date(now.getTime() + 10 * 60 * 1000),
      });

      await sendEmail({
        receiver: email,
        subject: "Reset Password OTP",
        text: html.forgotPasswordOtp(otp),
      });

      return ResponseHandler.sendOkResponse(null, "OTP sent to your email.", res);
    } else {
      return ResponseHandler.sendOkResponse(null, "OTP already sent to your email.", res);
    }
  } catch (error) {
    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

const forgotPasswordVerify = async (req, res) => {
  try {
    const { error } = validatePayload.forgotPasswordVerify(req.body);
    if (error) return ResponseHandler.sendBadResponse(error.details[0].message, res);

    const { email, otp, newPassword } = req.body;
    let user = await userRepository.findUser({ email });
    if (!user) return ResponseHandler.sendNotFoundResponse(Constants.USER_NOT_FOUND, res);

    if (!user.fotgotPasswordOtp || !user.fotgotPasswordOtpExpiry)
      return ResponseHandler.sendBadResponse("OTP not requested.", res);

    const now = new Date();
    if (now > new Date(user.fotgotPasswordOtpExpiry))
      return ResponseHandler.sendBadResponse("OTP expired.", res);

    const isOtpValid = await authService.verifyPassword(String(otp), user.fotgotPasswordOtp);
    if (!isOtpValid) return ResponseHandler.sendBadResponse("Invalid OTP.", res);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const updated = await userRepository.updateUser(user._id, {
      password: hashedPassword,
      fotgotPasswordOtp: null,
      fotgotPasswordOtpExpiry: null,
    });
    if (!updated) return ResponseHandler.sendBadResponse(Constants.ERROR_UPDATING, res);

    // return ResponseHandler.sendOkResponse(null, "Password reset successful.", res);
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

exports.authControllers = {
  userLogin,
  verifyEmail,
  passwordUpdate,
  requestForgotPasswordOTP,
  forgotPasswordVerify,
};
