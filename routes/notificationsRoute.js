const express = require("express");
const router = express.Router();
const { userAuth } = require("../middlewares/authmiddlewares");
const { addNotification, getNotification, getNotificationCount, markAsSeen } = require("../controller/common/notificationController");

router.post("/add/notification", addNotification)//just for testing
router.get('/get/notification', userAuth, getNotification)
router.get("/get/notification/count",userAuth, getNotificationCount)
router.put("/mark/notification", markAsSeen)

module.exports = router;