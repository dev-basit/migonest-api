const express = require("express");
const router = express.Router();
const { UserService } = require("../services");
const { adminMiddleware } = require("../middleware");

// all these routes will undergo authMiddleware since it is applied at global level
router.get("/", adminMiddleware, UserService.Users);
router.get("/:id", UserService.UserDetails); // check for only admin can get any user details, and normal users can only get their own details is written inside service function. For complex logic, separate the endpoint.
router.post("/", UserService.UserCreate);
router.put("/", UserService.UserUpdate); //  check for admin to update any user details, and normal users can only update their own details is written inside service function. For complex logic, separate the endpoint.

exports.usersControllers = router;
