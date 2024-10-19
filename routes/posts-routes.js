const express = require("express");
const router = express.Router();
const { postsControllers } = require("../controllers");

router.get("/", postsControllers.posts);
router.post("/", postsControllers.createPost);

exports.postsRoutes = router;
