const multer = require("multer");
const express = require("express");
const router = express.Router();
const { uploadControllers } = require("../controllers");
const { getCloudinaryStorage } = require("../utils/cloudinary");

const upload = multer({ storage: getCloudinaryStorage() });

router.post("/", upload.single("file"), uploadControllers.upload);

exports.uploadRoutes = router;
