const { authService } = require("./auth-service");
const { userService } = require("./user-service");
const { postService } = require("./post-service");
const { universityService } = require("./university-service");
const { uniExpertRequestService } = require("./uni-expert-request-service");
const { admissionService } = require("./admission-service");
const { becomeUniExpertService } = require("./become-uni-expert-service");
const { contactUsService } = require("./contact-us-service");
const { conversationService } = require("./conversation-service");
const { conversationMembersService } = require("./conversation-members-service");
const { messageService } = require("./message-service");
const { notificationService } = require("./notification-service");
const { purchaseService } = require("./purchase-service");
const { subscriptionService } = require("./subscription-service");
const { checkoutService } = require("./checkout-service");

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
  conversationMembersService,
  messageService,
  notificationService,
  purchaseService,
  subscriptionService,
  checkoutService,
};
