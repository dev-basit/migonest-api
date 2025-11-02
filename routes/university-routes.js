const express = require("express");
const router = express.Router();
const { universitiesControllers } = require("../controllers");
const { paginationMiddleware } = require("../middleware");

router.get("/", paginationMiddleware, universitiesControllers.universitiesFind);
router.post("/", universitiesControllers.universityCreate);
router.put("/:id", universitiesControllers.universityUpdate);

exports.universitiesRoutes = router;
