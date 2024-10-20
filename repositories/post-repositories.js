const { PostModel } = require("../models");

const findAllPosts = async (params = {}) => {
  try {
    return await PostModel.find(params)
      .populate("author", "userName firstName lastName profilePicture type")
      .sort({ createdAt: -1 });
  } catch (error) {
    throw new Error(error.message);
  }
};

const findPostById = async (id) => {
  try {
    return await PostModel.findById(id);
  } catch (error) {
    throw new Error(error.message);
  }
};

const createPost = async (data) => {
  try {
    const post = new PostModel(data);
    return await post.save();
  } catch (error) {
    throw new Error(error.message);
  }
};

const updatePost = async (postId, updatedData) => {
  try {
    return await PostModel.findByIdAndUpdate(postId, updatedData, { new: true });
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.postRepository = {
  findAllPosts,
  findPostById,
  createPost,
  updatePost,
};
