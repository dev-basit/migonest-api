const multer = require("multer");
const express = require("express");
const router = express.Router();
const { uploadControllers } = require("../controllers");

const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("file"), uploadControllers.upload);

exports.uploadRoutes = router;
