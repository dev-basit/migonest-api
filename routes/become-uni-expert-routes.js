const express = require("express");
const router = express.Router();
const { becomeUniExpertControllers } = require("../controllers");

router.get("/", becomeUniExpertControllers.becomeUniExpertsFind);
router.post("/", becomeUniExpertControllers.becomeUniExpertCreate);
router.put("/:id", becomeUniExpertControllers.becomeUniExpertUpdate);

exports.becomeUniExpertRoutes = router;
