const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const firmSchema = new mongoose.Schema(
  {
    firmId: {
      type: String,
      required: true,
      unique: true,
      default: uuidv4,
    },

    orgId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
   //  orgName: {
   //   type: String,
   //   required: true, // or false if optional
   // },

    code: {
      type: String,
      required: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    owners: [
      {
       _id: false,
        name: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String }, // kept optional
      },
    ],

    gstNumber: { type: String, unique: true, sparse: true }, // sparse allows nulls
    logo: { type: String },

    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
    },

    contact: {
      phone: String,
      email: String,
    },

    accountDetails: {
      bankName: String,
      accountNumber: String,
      ifscCode: String,
      branchName: String,
      accountHolderName: String,
    },

    website: String,
    registrationDate: { type: Date, default: Date.now },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    description: { type: String, default: "" },

    flowTypes: [
      {
        type: String,
        trim: true,
        required: false,
      },
    ],

    branding: {
      logoUrl: String,
      primaryColor: String,
      secondaryColor: String,
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

// ✅ Ensure firm `code` is unique per org
firmSchema.index({ orgId: 1, code: 1 }, { unique: true });

// ✅ Ensure firm `name` is unique per org
firmSchema.index({ orgId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("Firms", firmSchema);
