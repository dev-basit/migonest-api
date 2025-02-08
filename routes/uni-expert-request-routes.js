const express = require("express");
const router = express.Router();
const { uniExpertRequestsControllers } = require("../controllers");

router.get("/", uniExpertRequestsControllers.uniExpertRequestsFind);
router.post("/", uniExpertRequestsControllers.uniExpertRequestCreate);
router.put("/:id", uniExpertRequestsControllers.uniExpertRequestUpdate);

exports.uniExpertRequestRoutes = router;
