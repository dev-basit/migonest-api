const express = require("express");
const { purchaseControllers } = require("../controllers");

const router = express.Router();

router.get("/", purchaseControllers.purchasesFind);

exports.purchaseRoutes = router;
