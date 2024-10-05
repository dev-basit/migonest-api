const mongoose = require("mongoose");
const { Logger } = require("./logs");
const { config } = require("../config");

exports.initDatabase = async function () {
  const db = config.db;
  mongoose
    .connect(db, {})
    .then(() => Logger.info(`Connected to ${db}...`))
    .catch((err) => Logger.error(err));
};
