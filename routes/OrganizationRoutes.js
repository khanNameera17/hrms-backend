const { Route } = require("express");
const express = require("express");
const { createOrganization, getOrganization } = require("../controller/admin/OrganizationController");

const router = express.Router();

router.post("/create-organization", createOrganization);
router.get("/get-organization", getOrganization);
module.exports = router;