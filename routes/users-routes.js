const express = require("express");
const router = express.Router();
const { usersControllers } = require("../controllers");
const { adminMiddleware } = require("../middleware");

// all these routes will undergo authMiddleware since it is applied at global level
router.get("/", adminMiddleware, usersControllers.users);
router.get("/suggests/to/follow", usersControllers.userSuggestions);
router.get("/:id", usersControllers.userDetails); // check for only admin can get any user details, and normal users can only get their own details is written inside service function. For complex logic, separate the endpoint.
router.post("/", usersControllers.userCreate);
router.post("/follow/", usersControllers.followUser);
router.put("/", usersControllers.userUpdate); //  check for admin to update any user details, and normal users can only update their own details is written inside service function. For complex logic, separate the endpoint.

exports.usersRoutes = router;
