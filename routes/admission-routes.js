const express = require("express");
const router = express.Router();
const { admissionsControllers } = require("../controllers");

router.get("/", admissionsControllers.admissionsFind);
// router.post("/", admissionsControllers.admissionCreate);

exports.admissionRoutes = router;
