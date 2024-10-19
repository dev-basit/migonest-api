const { PostModel } = require("../models");

const findAllPosts = async (params = {}) => {
  try {
    return await PostModel.find(params);
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

exports.postRepository = {
  findAllPosts,
  findPostById,
  createPost,
};
