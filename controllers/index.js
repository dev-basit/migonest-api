const { authControllers } = require("./auth-controller");
const { usersControllers } = require("./users-controller");
const { usersProfileControllers } = require("./users-profile-controller");
const { postsControllers } = require("./posts-controller");
const { universitiesControllers } = require("./university-controller");
const { uniExpertRequestsControllers } = require("./uni-expert-request-controller");
const { admissionsControllers } = require("./admission-controller");

module.exports = {
  authControllers,
  usersControllers,
  usersProfileControllers,
  postsControllers,
  universitiesControllers,
  uniExpertRequestsControllers,
  admissionsControllers,
};
