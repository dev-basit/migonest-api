const express = require("express");
const router = express.Router();
const { messageControllers } = require("../controllers");

router.get("/:conversationId", messageControllers.messageFind);
router.post("/", messageControllers.messageCreate);

exports.messageRoutes = router;
