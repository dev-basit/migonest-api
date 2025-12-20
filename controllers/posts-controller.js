const { ResponseHandler, Constants } = require("../utils");
const { Logger } = require("../startup/logs");
const { postRepository, userRepository } = require("../repositories");
const { postService } = require("../services");

// TODO: api for share
const posts = async (req, res) => {
  try {
    const { pageNo, pageSize, skip } = req.pagination;

    Logger.info("Fetching followers list");
    const user = await userRepository.findUserDetailsById(req.user.id);
    const userFollowingIds = user.following.map((followingUser) => followingUser.followingId);
    userFollowingIds.push(req.user.id); // show user own post to user

    Logger.info(Constants.FETCHING_DATA);
    const { posts, count } = await postRepository.findAllPosts(
      { authorId: { in: userFollowingIds }, enabled: true },
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
      authorId: req.body.authorId,
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

    const isLikedAlready = post.likes.some((like) => like.userId === currentUserId);
    if (isLikedAlready) {
      await postRepository.deletePostLike(postId, currentUserId);
      return ResponseHandler.sendOkResponse(null, "Successfully disliked the post.", res);
    } else {
      await postRepository.createPostLike(postId, currentUserId);
      return ResponseHandler.sendOkResponse(null, "Successfully liked the post.", res);
    }
  } catch (error) {
    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

// TODO: dont allow shared post to be updated
// TODO: when deleting, delete from both, originol post share array, and authorId post record
const sharePost = async (req, res) => {
  try {
    const { postId } = req.body;
    if (!postId) return ResponseHandler.sendBadResponse("Post ID is required.", res);

    const post = await postRepository.findPostById(postId);
    if (!post) return ResponseHandler.sendNotFoundResponse("Post not found.", res);

    const newPost = {};
    newPost.authorId = req.user.id;
    newPost.content = post.content;
    newPost.picture = post.picture;
    newPost.isShared = true;

    Logger.info("Post being shared: " + JSON.stringify(post));
    Logger.info("New Post: " + JSON.stringify(newPost));

    let sharedPostCreated = await postRepository.createPost(newPost);
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

    if (postExisitngDetails.authorId.toString() !== req.user.id.toString())
      return ResponseHandler.sendForbiddenResponse(Constants.FORBIDDEN, res);

    const { content, picture, enabled } = req.body;
    const payload = {
      content: content || postExisitngDetails.content,
      picture: picture || postExisitngDetails.picture,
    };

    if (req.body.enabled !== undefined) payload.enabled = enabled;
    else payload.enabled = postExisitngDetails.enabled;

    const updatedPost = await postRepository.updatePost(postId, payload);
    if (!updatedPost) return ResponseHandler.sendBadResponse(Constants.ERROR_UPDATING, res);

    return ResponseHandler.sendOkResponse(updatedPost, Constants.SUCCESSFULLY_UPDATED_, res);
  } catch (error) {
    return ResponseHandler.sendInternalServerErrorResponse(error.message, res);
  }
};

exports.postsControllers = { posts, createPost, likeDislikePost, sharePost, updatePost };
