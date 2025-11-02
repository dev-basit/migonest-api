const { PostModel } = require("../models");

const findAllPosts = async (params = {}, { skip, pageSize }) => {
  try {
    const [posts, count] = await Promise.all([
      PostModel.find(params)
        .populate("author", "userName firstName lastName profilePicture type")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean(),
      PostModel.countDocuments(params),
    ]);
    return { posts, count };
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
