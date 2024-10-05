const express = require("express");
const app = express();
const { config } = require("./config");

const { initLogs, Logger } = require("./startup/logs");
initLogs(app);

const {
  initConfiguration,
  initCors,
  initRoutes,
  initDatabase,
  addMongooseObjectIdValidation,
} = require("./startup");

initConfiguration();
initCors(app);
initRoutes(app);
initDatabase();
addMongooseObjectIdValidation();

// server starting
const port = config.port;
const server = app.listen(port, () => Logger.info(`Listening on port ${port}...`));

module.exports = server;
