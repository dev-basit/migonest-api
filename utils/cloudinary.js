const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { config } = require("../config");

cloudinary.config({
  cloud_name: config.cloudinaryCloudName,
  api_key: config.cloudinaryApiKey,
  api_secret: config.cloudinaryApiSecret,
});

let storage = null;

function getCloudinaryStorage() {
  if (!storage) {
    storage = new CloudinaryStorage({
      cloudinary,
      params: async (req, file) => {
        const timestamp = Date.now();
        const originalName = file.originalname.split(".").slice(0, -1).join(".");
        // const extension = file.originalname.split(".").pop();

        return {
          folder: "migonest",
          allowed_formats: ["jpeg", "png", "jpg", "pdf"],
          resource_type: file.mimetype === "application/pdf" ? "raw" : "auto",
          public_id: `${originalName}_${timestamp}`,
        };
      },
    });
  }

  return storage;
}

module.exports = { getCloudinaryStorage };
