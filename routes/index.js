const { authRoutes } = require("./auth-routes");
const { usersRoutes } = require("./users-routes");
const { usersProfileRoutes } = require("./users-profile-routes");
const { postsRoutes } = require("./posts-routes");
const { universitiesRoutes } = require("./university-routes");
const { uniExpertRequestRoutes } = require("./uni-expert-request-routes");
const { admissionRoutes } = require("./admission-routes");
const { becomeUniExpertRoutes } = require("./become-uni-expert-routes");
const { contactUsRoutes } = require("./contact-us-routes");

module.exports = {
  authRoutes,
  usersRoutes,
  usersProfileRoutes,
  postsRoutes,
  universitiesRoutes,
  uniExpertRequestRoutes,
  admissionRoutes,
  becomeUniExpertRoutes,
  contactUsRoutes,
};
