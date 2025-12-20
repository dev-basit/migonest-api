const { userRepository } = require("./user-repositories");
const { userProfileRepository } = require("./user-profile-repositories");
const { postRepository } = require("./post-repositories");
const { universityRepository } = require("./university-repositories");
const { uniExpertRequestRepository } = require("./uni-expert-request-repositories");
const { admissionRepository } = require("./admission-repositories");
const { becomeUniExpertsRepository } = require("./become-uni-expert-repositories");
const { conversationRepository } = require("./conversation-repositories");
const { conversationMembersRepository } = require("./conversation-members-repositories");
const { messageRepository } = require("./message-repositories");
const { notificationRepository } = require("./notification-repositories");
const { purchaseRepository } = require("./purchase-repositories");
const { subscriptionRepository } = require("./subscription-repositories");
const { documentRepository } = require("./documents-repositories");

module.exports = {
  userRepository,
  userProfileRepository,
  postRepository,
  universityRepository,
  uniExpertRequestRepository,
  admissionRepository,
  becomeUniExpertsRepository,
  conversationRepository,
  conversationMembersRepository,
  messageRepository,
  notificationRepository,
  purchaseRepository,
  subscriptionRepository,
  documentRepository,
};
