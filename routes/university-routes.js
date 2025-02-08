const express = require("express");
const router = express.Router();
const { universitiesControllers } = require("../controllers");

router.get("/", universitiesControllers.universitiesFind);
router.post("/", universitiesControllers.universityCreate);

exports.universitiesRoutes = router;
