const jwt = require("jsonwebtoken");
const { config } = require("../config");
const { ResponseHandler, Constants } = require("../utils");

const jwtNotRequiredEndpoints = [
  { method: "POST", api: "/v1/auth/login" }, //login
  { method: "POST", api: "/v1/auth/verify/email" },
  { method: "POST", api: "/v1/users" }, // signup
];

// TODO: verify token using secret
// OR
// TDOD: add user token in db, verify at login time, on login delete prev record if exist, add new one
exports.authMiddleware = function (req, res, next) {
  try {
    let endpointFound = false;
    for (const item of jwtNotRequiredEndpoints) {
      if (req.originalUrl === item.api && req.method === item.method) {
        endpointFound = true;
        break;
      }
    }

    // if such endpoint is found for which we dont want jwt token, then skip the following code
    if (endpointFound) return next();

    const token = req.header("x-auth-token");
    if (!token) return ResponseHandler.sendUnauthorizedResponse(Constants.NO_TOKEN_PROVIDED, res);

    const decodedUser = jwt.verify(token, config.jwtPrivateKey);
    req.user = decodedUser;
    next();
  } catch (ex) {
    return ResponseHandler.sendBadResponse(Constants.INVALID_TOKEN, res);
  }
};
