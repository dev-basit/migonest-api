const express = require("express");
const router = express.Router();
const { postsControllers } = require("../controllers");

router.get("/", postsControllers.posts);
router.post("/", postsControllers.createPost);
router.post("/like/dislike", postsControllers.likeDislikePost);
router.post("/share", postsControllers.sharePost);
router.put("/:id", postsControllers.updatePost);

exports.postsRoutes = router;
