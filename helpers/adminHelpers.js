const User = require("../model/User");

exports.generateAdminCode = async () => {
 const lastAdmin = await User.findOne({ role: "admin" }).sort({ createdAt: -1 });

 if (!lastAdmin) {
     return "ADMIN-001";
 }

 // Extract the last numeric part and increment it
 const lastCode = parseInt(lastAdmin.code.split("-")[1]);
 return `ADMIN-${String(lastCode + 1).padStart(3, "0")}`;
};