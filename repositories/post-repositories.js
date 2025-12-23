const { db } = require("../startup/db");
const { userRepository } = require("./user-repositories");

const findAllPosts = async (params = {}, { skip, pageSize }) => {
  try {
    const [posts, count] = await Promise.all([
      db.posts.findMany({
        where: params,
        include: { author: { select: userRepository.userBasicInfo }, likes: { select: { userId: true } } },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      db.posts.count({ where: params }),
    ]);

    return { posts, count };
  } catch (error) {
    throw new Error(error.message);
  }
};

const findPostById = async (id) => {
  try {
    return await db.posts.findUnique({
      where: { id },
      include: { author: { select: userRepository.userBasicInfo }, likes: { select: { userId: true } } },
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

const createPost = async (data) => {
  try {
    return await db.posts.create({ data });
  } catch (error) {
    throw new Error(error.message);
  }
};

const updatePost = async (postId, updatedData) => {
  try {
    return await db.posts.update({ where: { id: postId }, data: updatedData });
  } catch (error) {
    throw new Error(error.message);
  }
};

const createPostLike = async (postId, userId) => {
  try {
    return await db.postLikes.create({ data: { postId, userId } });
  } catch (error) {
    throw new Error(error.message);
  }
};

const deletePostLike = async (postId, userId) => {
  try {
    return await db.postLikes.delete({ where: { postId_userId: { postId, userId } } });
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.postRepository = {
  findAllPosts,
  findPostById,
  createPost,
  updatePost,
  createPostLike,
  deletePostLike,
};
