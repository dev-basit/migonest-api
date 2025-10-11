const express = require("express");
const router = express.Router();
const { authControllers } = require("../controllers");
const { authMiddleware } = require("../middleware");

router.post("/login", authControllers.userLogin);
router.post("/verify/email", authControllers.verifyEmail);
router.post("/password/change", authMiddleware, authControllers.passwordUpdate);

exports.authRoutes = router;
