const { authService } = require("./auth-service");
const { userService } = require("./user-service");
const { postService } = require("./post-service");
const { universityService } = require("./university-service");
const { uniExpertRequestService } = require("./uni-expert-request-service");
const { admissionService } = require("./admission-service");
const { becomeUniExpertService } = require("./become-uni-expert-service");
const { contactUsService } = require("./contact-us-service");
const { conversationService } = require("./conversation-service");
const { messageService } = require("./message-service");
const { notificationService } = require("./notification-service");

module.exports = {
  authService,
  userService,
  postService,
  universityService,
  uniExpertRequestService,
  admissionService,
  becomeUniExpertService,
  contactUsService,
  conversationService,
  messageService,
  notificationService,
};
