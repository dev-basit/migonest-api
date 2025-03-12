const { authService } = require("./auth-service");
const { userService } = require("./user-service");
const { postService } = require("./post-service");
const { universityService } = require("./university-service");
const { uniExpertRequestService } = require("./uni-expert-request-service");
const { admissionService } = require("./admission-service");
const { becomeUniExpertService } = require("./become-uni-expert-service");
const { contactUsService } = require("./contact-us-service");

module.exports = {
  authService,
  userService,
  postService,
  universityService,
  uniExpertRequestService,
  admissionService,
  becomeUniExpertService,
  contactUsService,
};
