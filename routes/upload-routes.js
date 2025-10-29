const multer = require("multer");
const express = require("express");
const router = express.Router();
const { uploadControllers } = require("../controllers");
const { uploadBufferToCloudinary } = require("../utils/cloudinary");

const upload = multer({ storage: multer.memoryStorage() });

async function cloudinaryStreamMiddleware(req, res, next) {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await uploadBufferToCloudinary(req.file.buffer, req.file.originalname, req.file.mimetype);

    // Preserve controller expectation: req.file.path contains URL
    req.file.path = result.secure_url;
    req.file.public_id = result.public_id;
    req.file.resource_type = result.resource_type;

    return next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

router.post("/", upload.single("file"), cloudinaryStreamMiddleware, uploadControllers.upload);

exports.uploadRoutes = router;
