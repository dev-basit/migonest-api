const fs = require("fs");
const path = require("path");
const { config } = require("../config");
const { Logger } = require("../startup/logs");

const YEAR = new Date().getFullYear();

function readTemplate(fileName) {
  const filePath = path.resolve(__dirname, `../templates/${fileName}`);
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    Logger.error(`Failed to read template ${fileName}: ${error.message}`);
    return "";
  }
}

function verificationEmail(code) {
  let html = readTemplate("verification-code.html");
  if (!html) return `<div>Verification code: <strong>${code}</strong></div>`;

  return html
    .replace(/\{\{CODE\}\}/g, String(code))
    .replace("<!--YEAR-->", String(YEAR))
    .replace(/Migonest/g, config.APP_NAME);
}

function purchaseUniExpertService({ name, amount, reference }) {
  let html = readTemplate("purchase-uni-expert-service.html");
  if (!html) {
    return `
      <div>
        <div><strong>${config.APP_NAME}</strong> Purchase Confirmation</div>
        <div>Hi ${name}, thank you for purchasing Uni Expert Service.</div>
        <div>Amount: ${amount}</div>
        <div>Reference: ${reference}</div>
      </div>
    `;
  }

  return html
    .replace(/\{\{NAME\}\}/g, String(name || ""))
    .replace(/\{\{AMOUNT\}\}/g, String(amount || ""))
    .replace(/\{\{REFERENCE\}\}/g, String(reference || ""))
    .replace("<!--YEAR-->", String(YEAR))
    .replace(/Migonest/g, config.APP_NAME);
}

function subscriptionActivated({ name, plan, periodStart, periodEnd }) {
  let html = readTemplate("subscription-activated.html");
  if (!html) {
    return `
      <div>
        <div><strong>${config.APP_NAME}</strong> Subscription Activated</div>
        <div>Hi ${name}, your subscription is active.</div>
        <div>Plan: ${plan}</div>
        <div>Period: ${periodStart} - ${periodEnd}</div>
      </div>
    `;
  }

  return html
    .replace(/\{\{NAME\}\}/g, String(name || ""))
    .replace(/\{\{APP_NAME\}\}/g, String(config.APP_NAME))
    .replace(/\{\{PLAN\}\}/g, String(plan || ""))
    .replace(/\{\{PERIOD_START\}\}/g, String(periodStart || ""))
    .replace(/\{\{PERIOD_END\}\}/g, String(periodEnd || ""))
    .replace("<!--YEAR-->", String(YEAR))
    .replace(/Migonest/g, config.APP_NAME);
}

function subscriptionDeactivated({ name, periodEnd }) {
  let html = readTemplate("subscription-deactivated.html");
  if (!html) {
    return `
      <div>
        <div><strong>${config.APP_NAME}</strong> Subscription Deactivated</div>
        <div>Hi ${name}, your subscription has been deactivated.</div>
        <div>Pro access till: ${periodEnd}</div>
      </div>
    `;
  }

  return html
    .replace(/\{\{NAME\}\}/g, String(name || ""))
    .replace(/\{\{APP_NAME\}\}/g, String(config.APP_NAME))
    .replace(/\{\{PERIOD_END\}\}/g, String(periodEnd || ""))
    .replace("<!--YEAR-->", String(YEAR))
    .replace(/Migonest/g, config.APP_NAME);
}

function contactUs({ firstName, lastName, email, phone, message }) {
  let html = readTemplate("contact-us.html");
  if (!html) {
    return `
      <div>
        <div><strong>${config.APP_NAME}</strong> New Contact Message</div>
        <div>${message}</div>
        <div>Name: ${firstName} ${lastName}</div>
        <div>Email: ${email}</div>
        <div>Phone: ${phone}</div>
      </div>
    `;
  }

  return html
    .replace(/\{\{MESSAGE\}\}/g, String(message || ""))
    .replace(/\{\{FIRST_NAME\}\}/g, String(firstName || ""))
    .replace(/\{\{LAST_NAME\}\}/g, String(lastName || ""))
    .replace(/\{\{EMAIL\}\}/g, String(email || ""))
    .replace(/\{\{PHONE\}\}/g, String(phone || ""))
    .replace("<!--YEAR-->", String(YEAR))
    .replace(/Migonest/g, config.APP_NAME);
}

exports.html = {
  verificationEmail,
  purchaseUniExpertService,
  subscriptionActivated,
  subscriptionDeactivated,
  contactUs,
};
