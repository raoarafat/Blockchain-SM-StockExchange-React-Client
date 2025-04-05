const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the Investor schema
const CompanySchema = new Schema(
  {
    name: { type: String, required: true },
    sharePrice: { type: Number, required: true },
    detail: { type: Schema.Types.Mixed, default: {} }, // Any additional details
    createdAt: { type: Date, default: Date.now }, // Time when the data was saved in the DB
  },
  { versionKey: false }
);

// Create the model based on the schema
const Company = mongoose.model('company', CompanySchema);

module.exports = Company;
