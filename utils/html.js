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

exports.html = {
  verificationEmail,
};
