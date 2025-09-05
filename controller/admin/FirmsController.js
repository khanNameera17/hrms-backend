
const { generateFirmId } = require("../../helpers/firmHelper");
const ActorTypeHierarchy = require("../../model/ActorTypesHierarchy");
const Firms = require("../../model/Firms");
const Metadata = require("../../model/Metadata");
const Organization = require("../../model/Organization");
// const ActorTypesHierarchy = require("../model/ActorTypesHierarchy");
// const generateFirmId = require("../utils/generateFirmId");

exports.createFirms = async (req, res) => {
  try {
    const {
      code,
      name,
      orgName,
      description,
      branding,
      config,
      hierarchyTypeNames = [],
      owners,
      gstNumber,
      logo,
      address,
      contact,
      accountDetails,
      website,
      registrationDate,
      status,
    } = req.body;

    // ✅ Validate code
    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Firm code is required",
      });
    }

    const existingCode = await Firms.findOne({ code });
    if (existingCode) {
      return res.status(400).json({
        success: false,
        message: `Firm with code '${code}' already exists`,
      });
    }

    // 🔍 Find org by name
    const org = await Organization.findOne({ name: orgName });
    if (!org) {
      return res.status(404).json({
        success: false,
        message: "Organization not found: " + orgName,
      });
    }

    // 🔁 Check if firm with same name exists in this org
    const existingFirm = await Firms.findOne({ name, orgId: org._id });
    if (existingFirm) {
      return res.status(400).json({
        success: false,
        message: `Firm with name '${name}' already exists in organization '${orgName}'`,
      });
    }

    let foundFlowNames = [];

    // ✅ Only validate flows if provided
    if (hierarchyTypeNames.length > 0) {
      const flows = await ActorTypeHierarchy.find({
        name: { $in: hierarchyTypeNames },
      });
      foundFlowNames = flows.map((flow) => flow.name);

      const invalidFlowNames = hierarchyTypeNames.filter(
        (name) => !foundFlowNames.includes(name)
      );

      if (invalidFlowNames.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Some hierarchyTypeNames are invalid",
          invalidFlows: invalidFlowNames,
        });
      }
    }

    // ✅ Generate firmId
    const firmId = await generateFirmId(name); // e.g., Twc_Jai

    // ✅ Create and save new firm
    const firm = new Firms({
      code,
      firmId,
      name,
      orgId: org._id,
      orgName: org.name,
      description,
      branding,
      config,
      owners,
      gstNumber,
      logo,
      address,
      contact,
      accountDetails,
      website,
      registrationDate,
      status,
      flowTypes: foundFlowNames, // ✅ Will be [] if no flows given
    });

    await firm.save();

    return res.status(201).json({
      success: true,
      message:
        foundFlowNames.length > 0
          ? "Firm created successfully with flows"
          : "Firm created successfully without flows",
      data: firm,
    });
  } catch (error) {
    console.error("❌ Error creating firm:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create firm",
      error: error.message,
    });
  }
};
exports.getFirms = async (req, res) => {
 try {
   const firms = await Firms.find();

   return res.status(200).json({
     success: true,
     message: "Firms fetched successfully",
     data: firms,
   });
 } catch (error) {
   console.error("❌ Error fetching firms:", error);
   return res.status(500).json({
     success: false,
     message: "Failed to fetch firms",
     error: error.message,
   });
 }
};

exports.getAttendanceCountByFirms = async (req, res) => {
try {
  // Set date range to current day in IST
  const startDate = new Date();
  startDate.setUTCHours(-5, -30, 0, 0); // 00:00:00 IST
  const endDate = new Date();
  endDate.setUTCHours(18, 29, 59, 999); // 23:59:59 IST

  // Fetch firms with only name and code
  const firms = await Firms.find().select('name code');

  // Map through firms to add user count, user codes, and attendance counts
  const firmsWithUserData = await Promise.all(
    firms.map(async (firm) => {
      // Find users in metadata collection with matching firm_code and attendance true
      const users = await Metadata.find({ firm_code: firm.code, attendance: true }).select('code');
      
      // Extract user codes and count
      const userCodes = users.map(user => user.code);
      const totalUsers = users.length;

      // Build query for attendance records for current day
      const attendanceQuery = { 
        code: { $in: userCodes },
        date: { $gte: startDate, $lte: endDate }
      };

      // Find attendance records for these user codes
      const attendanceRecords = await Attendance.find(attendanceQuery).select('code status date');
      // console.log(`Firm: ${firm.name}, Attendance Records:`, attendanceRecords); // Debug log

      // Count present, leave, and halfDay
 const counts = {
 present: attendanceRecords.filter(r => {
   const status = r.status?.toLowerCase();
   return status === 'present' || status === 'pending';
 }).length,

 leave: attendanceRecords.filter(r => {
   const status = r.status?.toLowerCase();
   return status === 'leave';
 }).length,

 halfDay: attendanceRecords.filter(r => {
   const status = r.status?.toLowerCase();
   return status === 'half day'; // space between 'half' and 'day'
 }).length,
};


      // Calculate absent as totalUsers minus other counts
      counts.absent = totalUsers - (counts.present + counts.leave + counts.halfDay);

      // Ensure absent is not negative
      counts.absent = counts.absent < 0 ? 0 : counts.absent;

      // Return firm data with only required fields
      return {
        name: firm.name,
        code: firm.code,
        totalUsers,
        userCodes,
        attendanceCounts: counts,
      };
    })
  );

  return res.status(200).json({
    success: true,
    message: "Firms with attendance counts for current day fetched successfully",
    data: firmsWithUserData,
  });
} catch (error) {
  console.error("❌ Error fetching firms with attendance counts:", error);
  return res.status(500).json({
    success: false,
    message: "Failed to fetch firms with attendance counts",
    error: error.message,
  });
}
};

//get all firms for dropdown
exports.getFirmsForDropdown = async (req, res) => {
 try {
   const firms = await Firms.find().select('name code');

   return res.status(200).json({
     success: true,
     message: "Firms fetched successfully",
     data: firms,
   });
 } catch (error) {
   console.error("❌ Error fetching firms:", error);
   return res.status(500).json({
     success: false,
     message: "Failed to fetch firms",
     error: error.message,
   });
 }
};