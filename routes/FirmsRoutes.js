const express = require("express");
const { createFirms, getFirms, getAttendanceCountByFirms, getFirmsForDropdown } = require("../controller/admin/FirmsController");

const router = express.Router();

router.post("/create-firm", createFirms); 
router.get("/get-all-firms", getFirms); //nameera
router.get("/get-attendance-count-by-firms", getAttendanceCountByFirms);

//get firm dropdown
router.get("/get-firms-for-dropdown", getFirmsForDropdown);
module.exports = router;