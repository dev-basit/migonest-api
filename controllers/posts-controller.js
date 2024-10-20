const { ResponseHandler, Constants } = require("../utils");
const { Logger } = require("../startup/logs");
const { postRepository, userRepository } = require("../repositories");
const { postService } = require("../services");

// TODO: api for like and share
const posts = async (req, res) => {
  try {
    Logger.info("Fetching followers list");
    const user = await userRepository.findUserById(req.user._id);
    const userFollowingIds = user.following.map((followedUser) => followedUser._id);
    userFollowingIds.push(req.user._id); // show user own post to user

    Logger.info(Constants.FETCHING_DATA);
    const posts = await postRepository.findAllPosts({ author: { $in: userFollowingIds } });

    return ResponseHandler.sendOkResponse(posts, Constants.SUCCESSFULLY_FETCED, res);
  } catch (error) {
    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

const createPost = async (req, res) => {
  try {
    const requestedPayload = {
      author: req.body.author,
      content: req.body.content,
      picture: req.body.picture,
    };

    const { error } = postService.validateNewPostPayload(requestedPayload);
    if (error) return ResponseHandler.sendBadResponse(error.details[0].message, res);

    Logger.info(Constants.PAYLOAD_IS_CORRECT);

    let post = await postRepository.createPost(requestedPayload);

    return ResponseHandler.sendCreatedResponse(post, Constants.SUCCESSFULLY_ADDED, res);
  } catch (error) {
    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

exports.postsControllers = { posts, createPost };
