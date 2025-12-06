const express = require("express");
const app = express();
const { config } = require("./config");

const { initLogs, Logger } = require("./startup/logs");
initLogs();

const { initConfiguration, initCors, initRoutes, initDatabase } = require("./startup");

initConfiguration();
initCors(app);
initDatabase();
initRoutes(app);

// server starting
const port = config.port;
const server = app.listen(port, () => Logger.info(`Listening on port ${port}...`));

module.exports = server;
