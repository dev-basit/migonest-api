const express = require("express");
const router = express.Router();
const { documentsControllers } = require("../controllers");

router.get("/", documentsControllers.documentsFind);
router.post("/", documentsControllers.documentCreate);
router.put("/:id", documentsControllers.documentUpdate);
router.delete("/:id", documentsControllers.documentDelete);

exports.documentsRoutes = router;
