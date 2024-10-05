require("dotenv").config();

exports.config = {
  db: process.env.db || "mongodb://localhost:27017/migonest",
  port: process.env.port || 4002,
  jwtPrivateKey: process.env.jwtPrivateKey || "secureKey",
};
