const cors = require("cors");

exports.initCors = function (app) {
  app.use(cors());
};
