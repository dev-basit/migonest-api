const cloudinary = require("cloudinary").v2;
const { Readable } = require("stream");
const { config } = require("../config");

cloudinary.config({
  cloud_name: config.cloudinaryCloudName,
  api_key: config.cloudinaryApiKey,
  api_secret: config.cloudinaryApiSecret,
});

function generatePublicId(originalName, mimetype) {
  const timestamp = Date.now();
  const baseName = originalName.split(".").slice(0, -1).join(".");
  const fileExt = mimetype === "application/pdf" ? ".pdf" : "";
  return `${baseName.replace(/\s+/g, "_")}_${timestamp}${fileExt}`;
}

async function uploadBufferToCloudinary(buffer, originalname, mimetype) {
  return new Promise((resolve, reject) => {
    const publicId = generatePublicId(originalname, mimetype);
    const resourceType = mimetype === "application/pdf" ? "raw" : "auto";

    const uploadOptions = {
      folder: "migonest",
      public_id: publicId,
      resource_type: resourceType,
      allowed_formats: ["jpeg", "png", "jpg", "webp", "svg", "pdf"],
    };

    const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error) return reject(error);
      return resolve(result);
    });

    Readable.from(buffer).pipe(uploadStream);
  });
}

module.exports = { cloudinary, uploadBufferToCloudinary };
