const Organization = require("../../model/Organization");

// Create Organization
exports.createOrganization = async (req, res) => {
  try {
    let { code, name, description, contactEmail, contactPhone, subscriptionPlan, subscriptionExpiry, metadata } = req.body;

    // Basic validation
    if (!code || !name) {
      return res.status(400).json({ success: false, message: "Organization code and name are required." });
    }

    // Clean up inputs
    code = code.trim().toUpperCase();
    name = name.trim();

    // Check for duplicates
    const existingOrg = await Organization.findOne({ $or: [{ code }, { name }] });
    if (existingOrg) {
      return res.status(400).json({ success: false, message: "Organization with this code or name already exists." });
    }

    // Create organization
    const organization = await Organization.create({
      code,
      name,
      description: description || "",
      contactEmail,
      contactPhone,
      subscriptionPlan: subscriptionPlan || "free",
      subscriptionExpiry,
      status: "active",
      createdBy: req.user ? req.user._id : null, // from auth middleware
      metadata
    });

    return res.status(201).json({
      success: true,
      message: "Organization created successfully.",
      data: organization
    });

  } catch (error) {
    console.error("Error creating organization:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message
    });
  }
};
// ✅ Get organizations (all or by name)
exports.getOrganization = async (req, res) => {
 try {
   const { name } = req.query; // filter from query params

   let organizations;

   if (name) {
     // Case-insensitive search by name
     organizations = await Organization.findOne({
       name: { $regex: new RegExp("^" + name + "$", "i") },
     });

     if (!organizations) {
       return res.status(404).json({
         success: false,
         message: `Organization with name "${name}" not found`,
       });
     }
   } else {
     // Get all organizations
     organizations = await Organization.find();
   }

   res.status(200).json({
     success: true,
     data: organizations,
   });
 } catch (error) {
   console.error("Error fetching organizations:", error);
   res.status(500).json({
     success: false,
     message: "Failed to fetch organizations",
     error: error.message,
   });
 }
};