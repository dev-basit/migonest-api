const winston = require("winston");

class Logger {
  static info(message = "") {
    winston.info("   app - info " + message);
  }

  static error(message = "") {
    winston.error("  app - error " + message);
  }
}

function initLogs() {
  winston.exceptions.handle(
    new winston.transports.Console({ format: winston.format.simple() }),
    new winston.transports.File({ filename: "uncaughtExceptions.log" })
  );

  winston.add(new winston.transports.Console());
  winston.add(new winston.transports.File({ filename: "logfile.log" }));

  // globally handling exception and rejection that are not handled in the app
  process.on("uncaughtException", (err) => {
    Logger.error("global uncaughtException - " + err.message);
  });

  process.on("unhandledRejection", (reason, promise) => {
    Logger.error("global unhandledRejection - " + reason.message);
  });
}

exports.Logger = Logger;
exports.initLogs = initLogs;
