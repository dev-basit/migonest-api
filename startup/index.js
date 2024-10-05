const { initConfiguration } = require("./config");
const { initCors } = require("./cors");
const { initDatabase } = require("./db");
const { initLogs } = require("./logs");
const { initRoutes } = require("./routes");
const { addMongooseObjectIdValidation } = require("./validation");

module.exports = {
  initConfiguration,
  initLogs,
  initCors,
  initRoutes,
  initDatabase,
  addMongooseObjectIdValidation,
};
