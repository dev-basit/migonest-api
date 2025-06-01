const express = require("express");
const router = express.Router();
const { notificationControllers } = require("../controllers");

router.get("/", notificationControllers.notificationsFind);
router.post("/", notificationControllers.notificationCreate);
router.put("/:id", notificationControllers.notificationUpdate);

exports.notificationRoutes = router;
