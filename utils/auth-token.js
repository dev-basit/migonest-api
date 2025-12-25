const jwt = require("jsonwebtoken");
const { config } = require("../config");

function generateUserAuthToken(user) {
  if (!user) throw new Error("User is required to generate auth token.");

  const payload = {
    id: user.id || user.id,
    username: user.userName,
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    type: user.type,
    profilePicture: user.profilePicture,
    preferences: user.preferences,
    stripeCustomerId: user.stripeCustomerId,
  };

  return jwt.sign(payload, config.jwtPrivateKey);
}

exports.generateUserAuthToken = generateUserAuthToken;
