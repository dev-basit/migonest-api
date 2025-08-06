const express = require("express");
const { checkoutControllers } = require("../controllers");

const router = express.Router();

router.post("/billing-portal", checkoutControllers.createBillingPortalSession);
router.post("/uni/expert/service", checkoutControllers.createUniExpertServiceSession);
router.post("/subscription", checkoutControllers.createSubscriptionSession);

exports.checkoutRoutes = router;
