const express = require("express");
const router = express.Router();
const { usersProfileControllers } = require("../controllers");

// all these routes will undergo authMiddleware since it is applied at global level
router.post("/experiences", usersProfileControllers.experienceCreate);
router.put("/experiences/:id", usersProfileControllers.experienceUpdate);
router.post("/education", usersProfileControllers.educationCreate);
router.put("/education/:id", usersProfileControllers.educationUpdate);
router.post("/ielts", usersProfileControllers.ieltsCreate);
router.put("/ielts/:id", usersProfileControllers.ieltsUpdate);

exports.usersProfileRoutes = router;
