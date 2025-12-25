const { initConfiguration } = require("./config");
const { initCors } = require("./cors");
const { initDatabase } = require("./db");
const { initLogs } = require("./logs");
const { initRoutes } = require("./routes");

module.exports = {
  initConfiguration,
  initLogs,
  initCors,
  initRoutes,
  initDatabase,
};
