const express = require("express");
const router = express.Router();
const { contactUsControllers } = require("../controllers");

router.post("/", contactUsControllers.sendMessage);

exports.contactUsRoutes = router;
