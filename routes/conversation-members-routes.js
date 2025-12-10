const express = require("express");
const router = express.Router();
const { conversationMembersControllers } = require("../controllers");

router.get("/", conversationMembersControllers.conversationMembersFind);
// router.post("/", conversationMembersControllers.conversationMemberCreate);
router.put("/:id", conversationMembersControllers.conversationMemberUpdate);

exports.conversationMembersRoutes = router;
