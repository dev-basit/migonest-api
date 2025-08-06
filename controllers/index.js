const { authControllers } = require("./auth-controller");
const { usersControllers } = require("./users-controller");
const { usersProfileControllers } = require("./users-profile-controller");
const { postsControllers } = require("./posts-controller");
const { universitiesControllers } = require("./university-controller");
const { uniExpertRequestsControllers } = require("./uni-expert-request-controller");
const { admissionsControllers } = require("./admission-controller");
const { becomeUniExpertControllers } = require("./become-uni-expert-controller");
const { contactUsControllers } = require("./contact-us-controller");
const { uploadControllers } = require("./upload-controller");
const { conversationControllers } = require("./conversation-controller");
const { messageControllers } = require("./message-controller");
const { notificationControllers } = require("./notification-controller");
const { purchaseControllers } = require("./purchase-controller");
const { subscriptionControllers } = require("./subscription-controller");
const { checkoutControllers } = require("./checkout-controller");
const { stripeWebhooksControllers } = require("./stripe-webhooks-controller");

module.exports = {
  authControllers,
  usersControllers,
  usersProfileControllers,
  postsControllers,
  universitiesControllers,
  uniExpertRequestsControllers,
  admissionsControllers,
  becomeUniExpertControllers,
  contactUsControllers,
  uploadControllers,
  conversationControllers,
  messageControllers,
  notificationControllers,
  purchaseControllers,
  subscriptionControllers,
  checkoutControllers,
  stripeWebhooksControllers,
};
