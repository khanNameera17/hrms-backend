// // model/MetaData.js
// const mongoose = require('mongoose');

// const metaDataSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

// module.exports = mongoose.model('MetaData', metaDataSchema);

// model/MetaData.js
const mongoose = require('mongoose');

const metaDataSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

// Prevent OverwriteModelError
module.exports = mongoose.models.MetaData || mongoose.model('MetaData', metaDataSchema);
