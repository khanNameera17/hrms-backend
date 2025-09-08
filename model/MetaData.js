const mongoose = require("mongoose");

const metaDataSchema = new mongoose.Schema(
  {},
  { strict: false, timestamps: true }
);

// Prevent OverwriteModelError
module.exports =
  mongoose.models.MetaData || mongoose.model("MetaData", metaDataSchema);
