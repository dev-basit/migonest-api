const { v2: cloudinary } = require("cloudinary");
const streamifier = require("streamifier");
const { config } = require("../config");

cloudinary.config({
  cloud_name: config.cloudinaryCloudName,
  api_key: config.cloudinaryApiKey,
  api_secret: config.cloudinaryApiSecret,
});

const uploadStreamToCloudinary = (buffer, originalName, isPDF = false) => {
  return new Promise((resolve, reject) => {
    const timestamp = Date.now();
    const baseName = originalName.split(".").slice(0, -1).join("_");

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "migonest",
        resource_type: isPDF ? "raw" : "auto",
        public_id: `${baseName}_${timestamp}`,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

module.exports = { uploadStreamToCloudinary };
