const { ResponseHandler, Constants } = require("../utils");
const { Logger } = require("../startup/logs");
const { postRepository, userRepository } = require("../repositories");
const { postService } = require("../services");

// TODO: api for share
const posts = async (req, res) => {
  try {
    const { pageNo, pageSize, skip } = req.pagination;

    Logger.info("Fetching followers list");
    const user = await userRepository.findUserById(req.user.id);
    const userFollowingIds = user.following.map((followedUser) => followedUser.id);
    userFollowingIds.push(req.user.id); // show user own post to user

    Logger.info(Constants.FETCHING_DATA);
    const { posts, count } = await postRepository.findAllPosts(
      { author: { $in: userFollowingIds }, isVisible: true },
      { skip, pageSize }
    );

    return ResponseHandler.sendOkResponse(
      { posts, pagination: { count, pageNo, pageSize, totalPages: Math.ceil(count / pageSize) } },
      Constants.SUCCESSFULLY_FETCED,
      res
    );
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

const likeDislikePost = async (req, res) => {
  try {
    const { postId } = req.body;
    const currentUserId = req.user.id;

    if (!postId) return ResponseHandler.sendBadResponse("Post ID is required.", res);

    const post = await postRepository.findPostById(postId);
    if (!post) return ResponseHandler.sendNotFoundResponse("Post not found.", res);

    const isLikedAlready = post.likes.includes(currentUserId);
    if (isLikedAlready) {
      const updatedPost = await postRepository.updatePost(postId, { $pull: { likes: currentUserId } });
      return ResponseHandler.sendOkResponse(updatedPost, "Successfully disliked the post.", res);
    } else {
      const updatedPost = await postRepository.updatePost(postId, { $addToSet: { likes: currentUserId } });
      return ResponseHandler.sendOkResponse(updatedPost, "Successfully liked the post.", res);
    }
  } catch (error) {
    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

// TODO: dont allow shared post to be updated
// TODO: when deleting, delete from both, originol post share array, and author post record
const sharePost = async (req, res) => {
  try {
    const { postId } = req.body;
    if (!postId) return ResponseHandler.sendBadResponse("Post ID is required.", res);

    const post = await postRepository.findPostById(postId);
    if (!post) return ResponseHandler.sendNotFoundResponse("Post not found.", res);

    const newPost = {};
    newPost.author = req.user.id;
    newPost.content = post.content;
    newPost.picture = post.picture;
    newPost.isShared = true;
    newPost.likes = [];
    newPost.shares = [];

    console.log("newpost ", newPost);

    Logger.info("Post being shared: " + JSON.stringify(post));
    Logger.info("New Post: " + JSON.stringify(newPost));

    // TODO: apply transaction here
    let sharedPostCreated = await postRepository.createPost(newPost);
    await postRepository.updatePost(postId, { $push: { shares: sharedPostCreated.id } });
    return ResponseHandler.sendOkResponse(sharedPostCreated, "Successfully shared the post.", res);
  } catch (error) {
    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    if (!postId) return ResponseHandler.sendBadResponse(Constants.SEND_ID_IN_PARAMS, res);

    const postExisitngDetails = await postRepository.findPostById(postId);
    if (!postExisitngDetails) return ResponseHandler.sendNotFoundResponse(Constants.DATA_NOT_FOUND, res);

    if (postExisitngDetails.author.toString() !== req.user.id.toString())
      return ResponseHandler.sendForbiddenResponse(Constants.FORBIDDEN, res);

    const { content, picture, isVisible } = req.body;
    const payload = {
      content: content || postExisitngDetails.content,
      picture: picture || postExisitngDetails.picture,
    };

    if (req.body.isVisible !== undefined) payload.isVisible = isVisible;
    else payload.isVisible = postExisitngDetails.isVisible;

    const updatedPost = await postRepository.updatePost(postId, payload);
    if (!updatedPost) return ResponseHandler.sendBadResponse(Constants.ERROR_UPDATING, res);

    return ResponseHandler.sendOkResponse(updatedPost, Constants.SUCCESSFULLY_UPDATED_, res);
  } catch (error) {
    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

exports.postsControllers = { posts, createPost, likeDislikePost, sharePost, updatePost };
