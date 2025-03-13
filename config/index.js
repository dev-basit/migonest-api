require("dotenv").config();

exports.config = {
  db: process.env.db,
  port: process.env.port,
  jwtPrivateKey: process.env.jwtPrivateKey,
  cloudinaryCloudName: process.env.cloudinary_cloud_name,
  cloudinaryApiKey: process.env.cloudinary_api_key,
  cloudinaryApiSecret: process.env.cloudinary_api_secret,
};
