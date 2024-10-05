const express = require("express");
const router = express.Router();
const { AuthService } = require("../services");

router.post("/", AuthService.UserLogin);

exports.authControllers = router;
