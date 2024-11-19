const nodemailer = require("nodemailer");
const { Logger } = require("../startup/logs");

// TODO:change hardcoded details
// TODO: apply rate limiting to email verification code

const emailer = nodemailer.createTransport({
  host: "smtp.gmail.com",
  service: "gmail",
  port: 465,
  secure: true,
  auth: {
    from: process.env.EMAIL_USER,
    to: process.env.TO_EMAIL,

    user: process.env.EMAIL_SENDER || "migonest.verify@gmail.com",
    pass: process.env.EMAIL_PASS || "wqiq ccsr zckp enyx",
  },
});

async function sendEmail(data) {
  try {
    Logger.info(`Sending email to ${data.receiver}`);

    await emailer.sendMail({
      from: process.env.EMAIL_SENDER || "migonest.verify@gmail.com",
      to: data.receiver,
      subject: "Email Verification Code",
      text: `Code: ${data.code}`,
    });

    Logger.info(`Successfully sent email to ${data.receiver}`);
  } catch (e) {
    throw new Error(e);
  }
}

exports.sendEmail = sendEmail;
