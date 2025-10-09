const { Logger } = require("../startup/logs");
const { config } = require("../config");
const { Resend } = require("resend");

// TODO: apply rate limiting to email verification code

const resend = new Resend(config.RESEND_API_KEY);

const VERIFY_EMAIL = "verify@migonest.com";
const INFO_EMAIL = "info@migonest.com";

async function sendViaResend({ from, to, subject, text }) {
  try {
    const response = await resend.emails.send({
      from: from,
      to: to,
      subject: subject,
      html: text,
    });

    if (response.error) {
      Logger.error(`Error: ${response.error.message}`);
      throw new Error(response.error.message);
    }
  } catch (error) {
    Logger.error(`Resend API error: ${error.response?.data || error.message}`);
    throw new Error(error.message);
  }
}

async function sendEmail(data) {
  try {
    Logger.info(`Sending email to ${data.receiver}`);

    await sendViaResend({
      from: VERIFY_EMAIL,
      to: data.receiver,
      subject: data.subject || `${config.APP_NAME} - Email Verification Code`,
      text: data.text || `Code: ${data.code}`,
    });

    Logger.info(`Successfully sent email to ${data.receiver}`);
  } catch (e) {
    throw new Error(e);
  }
}

async function sendContactUsMail(data) {
  try {
    Logger.info(`Email receiving from ${data.email}`);

    const message = `<p>  
    ${data.message}
    
    Sender Details:
    Regards: ${data.firstName} ${data.lastName}
    Phone No: ${data.phone}
    Email: ${data.email}
    </p>
    `;

    await sendViaResend({
      from: INFO_EMAIL,
      to: "migonest.contact@gmail.com",
      subject: "Migonest Contact Us",
      text: message,
    });

    Logger.info(`Successfully sent email to migonest.contact@gmail.com`);
  } catch (e) {
    throw new Error(e);
  }
}

exports.sendEmail = sendEmail;
exports.sendContactUsMail = sendContactUsMail;
