const express = require("express");
const { stripeWebhooksControllers } = require("../controllers");

const router = express.Router();

router.post("/", stripeWebhooksControllers.webhook);

exports.stripeWebhooksRoutes = router;
