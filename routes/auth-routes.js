const express = require("express");
const router = express.Router();
const { authControllers } = require("../controllers");

router.post("/login", authControllers.userLogin);
router.post("/verify/email", authControllers.verifyEmail);

exports.authRoutes = router;
