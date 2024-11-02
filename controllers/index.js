const { authControllers } = require("./auth-controller");
const { usersControllers } = require("./users-controller");
const { usersProfileControllers } = require("./users-profile-controller");
const { postsControllers } = require("./posts-controller");

module.exports = { authControllers, usersControllers, usersProfileControllers, postsControllers };
