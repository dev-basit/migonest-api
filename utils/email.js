const nodemailer = require("nodemailer");
const { Logger } = require("../startup/logs");

// TODO:change hardcoded details
// TODO: apply rate limiting to email verification code

const verifyEmailer = nodemailer.createTransport({
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

const contactEmailer = nodemailer.createTransport({
  host: "smtp.gmail.com",
  service: "gmail",
  port: 465,
  secure: true,
  auth: {
    // from: process.env.EMAIL_USER,
    // to: process.env.TO_EMAIL,

    user: process.env.EMAIL_SENDER || "migonest.contact@gmail.com",
    pass: process.env.EMAIL_PASS || "oeht ekke ttuk naai",
  },
});

async function sendEmail(data) {
  try {
    Logger.info(`Sending email to ${data.receiver}`);

    await verifyEmailer.sendMail({
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

async function sendContactUsMail(data) {
  try {
    Logger.info(`Email receiving from ${data.email}`);

    await contactEmailer.sendMail({
      from: process.env.EMAIL_SENDER || data.email,
      to: "migonest.contact@gmail.com",
      subject: "Migonest Contact Us",
      text: `
      
      ${data.message}
      
      Regards: ${data.firstName} ${data.lastName}
      Phone No: ${data.phone} 
      `,
    });

    Logger.info(`Successfully sent email to migonest.contact@gmail.com`);
  } catch (e) {
    throw new Error(e);
  }
}

exports.sendEmail = sendEmail;
exports.sendContactUsMail = sendContactUsMail;
