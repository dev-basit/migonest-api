const express = require("express");
const {
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
} = require("../routes");
const { authMiddleware, errorMiddleware, logMiddleware } = require("../middleware");

exports.initRoutes = function (app) {
  // Stripe webhooks need raw body for signature verification
  app.use("/v1/stripe/webhooks", express.raw({ type: "application/json" }), stripeWebhooksRoutes);

  // TODO: photo being used in signup, so no token
  // TODO: create seperate, so we can ratelimit
  app.use("/v1/upload", uploadRoutes);

  app.use(express.json());
  app.use(logMiddleware);
  app.use("/v1/auth", authRoutes);
  app.use(authMiddleware); // Check if user send jwt token or not. It will also decode it to extract cosnumer details and it to req object, so all middlware below can access it via req.user
  app.use("/v1/users", usersRoutes);
  app.use("/v1/users/profile", usersProfileRoutes);
  app.use("/v1/posts", postsRoutes);
  app.use("/v1/universities", universitiesRoutes);
  app.use("/v1/uni/expert/requests", uniExpertRequestRoutes);
  app.use("/v1/admissions", admissionRoutes);
  app.use("/v1/become/uni/experts", becomeUniExpertRoutes);
  app.use("/v1/contact/us", contactUsRoutes);
  app.use("/v1/conversations", conversationRoutes);
  app.use("/v1/conversation-members", conversationMembersRoutes);
  app.use("/v1/messages", messageRoutes);
  app.use("/v1/notifications", notificationRoutes);
  app.use("/v1/purchases", purchaseRoutes);
  app.use("/v1/subscriptions", subscriptionRoutes);
  app.use("/v1/checkout", checkoutRoutes);
  app.use("/v1/documents", documentsRoutes);
  app.use(errorMiddleware);
};
