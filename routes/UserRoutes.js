const express = require("express");
const upload = require("../helpers/multerHelper");
const { registerSuperAdmin, deactivateUserBySuperAdmin, registerUserBySuperAdmin, registerAdminForSuperAdmin, editAdminProfile, registerUserByAdmin, deactivateUserByAdmin, updateBulkDealersFromCSV, loginAdminOrSuperAdmin, editUserByAdmins, deleteUserByAdmins, getUsersForAdmins, updateBulkDealers, activateAndVerifyUser, activateAllUsersInAllCases, registerOrUpdateUsersFromActorCodes, getAllDealerAndMddForAdmin, updateUserLabelsFromCSV, createSecurityKey } = require("../controller/Admin/UserController");
const { loginUser, editProfileForUser, changeUserPassword, getProfile, editUsers, getUsersDetails, getUsersByPositions, forgetPasswordForApp, getAllHierarchyUsersByFirm, updateDealerTownFromCSV } = require("../controller/common/UserController");
const { fetchCreditLimit, loginUserForApp, loginMddWithFirebasePhone, registerUserForApp, handleRefreshToken } = require("../controller/web/UserController");
const { superAdminAuth, adminAuth, userAuth, adminOrSuperAdminAuth } = require("../middlewares/authmiddlewares");
const router = express.Router();

// ============================ SUPER ADMIN ================================
router.post("/register-super-admin", registerSuperAdmin);
// router.post("/login-super-admin", loginSuperAdmin);
 // only by super admin
router.patch("/deactivate-user-by-super-admin/:id", superAdminAuth, deactivateUserBySuperAdmin);
router.post("/register-user-by-super-admin", superAdminAuth, registerUserBySuperAdmin);
router.post("/register-admin-by-super-admin", superAdminAuth, registerAdminForSuperAdmin);
router.put("/edit-admin-profile-by-super-admin/:id", superAdminAuth, editAdminProfile );
// ============================ /SUPER ADMIN ================================


// ============================ ADMIN ================================
// router.post("/register-admin", superAdminAuth, registerAdmin);
// router.post("/login-admin", loginAdmin);
router.put("/edit-admin-profile/:id", editAdminProfile );
router.post("/register-user-by-admin", adminAuth, registerUserByAdmin);
router.patch("/deactivate-user-by-admin/:id", adminAuth, deactivateUserByAdmin);

// router.put("/bulk-lats-longs-upload", upload.single("file"), updateBulkLatLongForAdmin);

router.put("/bulk-update-dealers", upload.single("file"), updateBulkDealersFromCSV); 

//  =========================== /ADMIN ================================

//user
router.post("/login-admin-or-super-admin", loginAdminOrSuperAdmin)
router.post("/login-user", loginUser);
router.put("/edit-profile", userAuth, editProfileForUser);

//admin and super admin common routes
router.put("/user/edit-by-admins/:id", adminOrSuperAdminAuth, editUserByAdmins);
router.delete("/user/delete-by-admins/:id", adminOrSuperAdminAuth, deleteUserByAdmins);
router.get("/user/get-by-admins", adminOrSuperAdminAuth, getUsersForAdmins);
router.post('/user/update-dealer-using-csv-by-admin', adminOrSuperAdminAuth, upload.single("file"), updateBulkDealers)
// Private: Only Admin or Super Admin can activate and verify an employee
router.patch("/activate-verify-user-by-admin-or-super-admin/:id", adminOrSuperAdminAuth, activateAndVerifyUser);

router.put("/activate-all-users-in-all-cases", activateAllUsersInAllCases);

router.put("/admin/register-update-from-actor-codes", registerOrUpdateUsersFromActorCodes);

//get dealer
router.get("/user/get-dealer-for-admin", adminOrSuperAdminAuth, getAllDealerAndMddForAdmin)
// get dealers credit limit
router.get("/fetch-dealer-credit-limit", userAuth, fetchCreditLimit);
    


// USER APIS 
router.post("/app/user/login", loginUserForApp);
router.post("/app/user/firebase-mdd-login-by-phone", loginMddWithFirebasePhone);

router.post("/app/user/register", registerUserForApp);
router.post("/user/change-password",userAuth, changeUserPassword);
router.get("/user/get-profile", userAuth, getProfile);

// edit user by thier role 

router.put("/edit-users-by-code",userAuth, editUsers);
router.get('/get-users-by-code', userAuth, getUsersDetails);


router.post("/admin/get-users-by-positions", getUsersByPositions);

router.put("/admin/update-user-labels", upload.single('file'), updateUserLabelsFromCSV);

router.post("/admin/create-security-key", superAdminAuth, createSecurityKey);

//Refresh token
router.post("/user/Refresh-token", handleRefreshToken);
router.put("/reset-pass-for-app", forgetPasswordForApp);
router.get("/get-user-by-firm", getAllHierarchyUsersByFirm);

// nameera
router.put("/update-dealers-town",upload.single('file'), adminOrSuperAdminAuth, updateDealerTownFromCSV);
module.exports = router;    