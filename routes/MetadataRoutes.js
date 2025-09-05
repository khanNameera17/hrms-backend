// routes/metadataRoutes.js
const express = require('express');

const upload = require("../helpers/multerHelper");
const { uploadMetadata, getEmployeesForAttendanceCount, listMetadata, bulkUpsertMetadata, downloadMetadata, cleanExtraTimestamps } = require('../controller/common/MetadataController');
const router = express.Router();


router.post('/upload-metadata', upload.single('file'), uploadMetadata);
router.get('/get-total-employee-count', getEmployeesForAttendanceCount);

router.get('/metadata/list', listMetadata);
router.put('/upsert-metadata', upload.single('file'), bulkUpsertMetadata);
router.get("/metadata/download", downloadMetadata);
router.delete("/metadata/clean-timestamps", cleanExtraTimestamps);

module.exports = router;
