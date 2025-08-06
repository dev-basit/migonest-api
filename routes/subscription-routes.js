const express = require("express");
const { subscriptionControllers } = require("../controllers");

const router = express.Router();

router.get("/", subscriptionControllers.subscriptionFind);

exports.subscriptionRoutes = router;
