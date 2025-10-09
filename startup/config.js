const { config } = require("../config");
const { Logger } = require("./logs");

// I dont want to start the app running if the envs are not provided
// In this case, terminate the server process.
// There are 2 ways: Explicitly terminate the process OR Throw unhandled exception

// Method 1: Explicitly terminating the process
exports.initConfiguration = function () {
  if (!config.clientUrl) {
    Logger.error("ERROR STARTING SERVER: client url is not defined in environment variables.");
    process.exit(1);
  }

  if (!config.db) {
    Logger.error("ERROR STARTING SERVER: database connection is not defined in environment variables.");
    process.exit(1); // terminate the app process
  }

  if (!config.port) {
    Logger.error("ERROR STARTING SERVER: port number is not defined in environment variables.");
    process.exit(1);
  }

  if (!config.jwtPrivateKey) {
    Logger.error("ERROR STARTING SERVER: jwtPrivateKey is not defined in environment variables.");
    process.exit(1);
  }

  if (!config.cloudinaryCloudName) {
    Logger.error("ERROR STARTING SERVER: cloudinary cloud name is not defined in environment variables.");
    process.exit(1);
  }

  if (!config.cloudinaryApiKey) {
    Logger.error("ERROR STARTING SERVER: cloudinary api key is not defined in environment variables.");
    process.exit(1);
  }

  if (!config.cloudinaryApiSecret) {
    Logger.error("ERROR STARTING SERVER: cloudinary api secret is not defined in environment variables.");
    process.exit(1);
  }

  if (!config.stripeSecretKey) {
    Logger.error("ERROR STARTING SERVER: stripe secret key is not defined in environment variables.");
    process.exit(1);
  }

  if (!config.stripeMonthlyPriceId) {
    Logger.error("ERROR STARTING SERVER: stripe monthly price id is not defined in environment variables.");
    process.exit(1);
  }

  // if (!config.stripeYearlyPriceId) {
  //   Logger.error("ERROR STARTING SERVER: stripe yearly price id is not defined in environment variables.");
  //   process.exit(1);
  // }

  if (!config.stripeWebhookSecret) {
    Logger.error("ERROR STARTING SERVER: stripe webhook secret is not defined in environment variables.");
    process.exit(1);
  }

  if (!config.RESEND_API_KEY) {
    Logger.error("ERROR STARTING SERVER: resend api key is not defined in environment variables.");
    process.exit(1);
  }
};

////////////
// Method 2: Throwing unhandled exception

// deliberately not handling this function code within try-catch
// in nodejs, unhandled exceptions and unhandled rejections, terminates the app process

// exports.initConfiguration = function () {
//   if (!config.db) {
//     throw new Error("ERROR: database connection is not defined.");
//   }

//   if (!config.port) {
//     throw new Error("ERROR: port number is not defined.");
//   }

//   if (!config.jwtPrivateKey) {
//     throw new Error("ERROR: jwtPrivateKey is not defined.");
//   }
// };
