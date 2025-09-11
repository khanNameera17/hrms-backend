const express = require("express");
const { userAuth } = require("../middlewares/authmiddlewares");
const { requestLeave, getRequestLeaveForEmp, getLeaveApplications, editLeaveApplication } = require("../controller/common/leaveController");
const router = express.Router();
router.post("/request-leave", userAuth, requestLeave);
router.get("/get-requested-leave-emp", userAuth, getRequestLeaveForEmp);

// get all leave requests
router.get("/all-leaves/admin", userAuth, getLeaveApplications)
router.post("/edit-leave", userAuth, editLeaveApplication);
module.exports = router;