const { authRoutes } = require("./auth-routes");
const { usersRoutes } = require("./users-routes");
const { usersProfileRoutes } = require("./users-profile-routes");
const { postsRoutes } = require("./posts-routes");
const { universitiesRoutes } = require("./university-routes");
const { uniExpertRequestRoutes } = require("./uni-expert-request-routes");
const { admissionRoutes } = require("./admission-routes");
const { becomeUniExpertRoutes } = require("./become-uni-expert-routes");
const { contactUsRoutes } = require("./contact-us-routes");
const { uploadRoutes } = require("./upload-routes");
const { conversationRoutes } = require("./conversation-routes");
const { conversationMembersRoutes } = require("./conversation-members-routes");
const { messageRoutes } = require("./message-routes");
const { notificationRoutes } = require("./notification-routes");
const { purchaseRoutes } = require("./purchase-routes");
const { subscriptionRoutes } = require("./subscription-routes");
const { checkoutRoutes } = require("./checkout-routes");
const { stripeWebhooksRoutes } = require("./stripe-webhooks-routes");
const { documentsRoutes } = require("./documents-routes");

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
  uploadRoutes,
  conversationRoutes,
  conversationMembersRoutes,
  messageRoutes,
  notificationRoutes,
  purchaseRoutes,
  subscriptionRoutes,
  checkoutRoutes,
  stripeWebhooksRoutes,
  documentsRoutes,
};
