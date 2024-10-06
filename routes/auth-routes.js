const express = require("express");
const router = express.Router();
const { authControllers } = require("../controllers");

router.post("/login", authControllers.userLogin);

exports.authRoutes = router;
