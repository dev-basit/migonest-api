const express = require("express");
const router = express.Router();
const { conversationControllers } = require("../controllers");

router.get("/", conversationControllers.conversationsFind);
router.post("/", conversationControllers.conversationCreate);
router.put("/:id", conversationControllers.conversationUpdate);

exports.conversationRoutes = router;
