const express = require("express");
const upload = require("../helpers/multerHelper");
const { getActorCodeForAdminAndSuperAdmin, addActorCode, uploadBulkActorCodes, editActorCode, deleteActorCode, getEmployeeCodeAndName } = require("../controller/admin/ActorCodeController");
const { adminOrSuperAdminAuth, userAuth } = require("../middlewares/authmiddlewares");

const router = express.Router();

//Actorcodes
router.get("/get-actorcode", adminOrSuperAdminAuth, getActorCodeForAdminAndSuperAdmin)
router.post("/upload-actorcode-csv", upload.single("file"), 

// adminOrSuperAdminAuth,
 uploadBulkActorCodes);
router.post("/add-actorcode", addActorCode)
router.put("/edit-actorcode/:id", userAuth, editActorCode)
router.delete("/delete/actorcode/:id", adminOrSuperAdminAuth, deleteActorCode)

//admin
router.get("/actorCode/get-actorCode-for-admin", getEmployeeCodeAndName)

module.exports = router;