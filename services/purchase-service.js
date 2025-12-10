const { config } = require("../config");
const { userRepository, uniExpertRequestRepository, purchaseRepository } = require("../repositories");
const { Logger } = require("../startup/logs");
const { sendEmail, html } = require("../utils");

const purchaseUniExpertRequest = async (session) => {
  const { userId, uniExpertRequestId } = session.metadata;
  if (!userId || !uniExpertRequestId) throw new Error("User id or uni expert request id not found");

  const user = await userRepository.findUserById(userId);
  if (!user) throw new Error(`User not found for id: ${userId}`);

  const requestExisitngDetails = await uniExpertRequestRepository.findUniExpertRequestById(
    uniExpertRequestId
  );
  if (!requestExisitngDetails) throw new Error("Uni expert request not found");

  await uniExpertRequestRepository.updateUniExpertRequest(uniExpertRequestId, {
    paymentStatus: true,
    stripePurchaseId: session.id,
  });

  Logger.info(`Payment received for Uni expert request id ${uniExpertRequestId} `);

  await purchaseRepository.createPurchase({
    userId,
    uniExpertRequestId,
    type: "UNI_EXPERT_REQUEST",
    amount: session.amount_total / 100,
    stripePurchaseId: session.id,
  });

  Logger.info(`Purchase created for user ${userId} with amount ${session.amount_total / 100}`);

  await sendEmail({
    receiver: user.email,
    subject: `${config.APP_NAME} Purchase Confirmation`,
    text: html.purchaseUniExpertService({
      name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      amount: session.amount_total / 100,
      reference: session.id,
    }),
  });
};

exports.purchaseService = {
  purchaseUniExpertRequest,
};
