const cors = require("cors");
const { config } = require("../config");

exports.initCors = function (app) {
  app.use(
    cors({
      origin: config.clientUrl,
    })
  );
};
