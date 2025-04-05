// Check if we're on the server side
let mongoose;
let Investor;

if (typeof window === 'undefined') {
  // We're on the server side
  mongoose = require('mongoose');
  const { Schema } = mongoose;

  const InvestorSchema = new Schema(
    {
      name: { type: String, required: true },
      fund: { type: Number, required: true },
      detail: { type: Schema.Types.Mixed, default: {} },
      createdAt: { type: Date, default: Date.now },
    },
    { versionKey: false }
  );

  // Fix the export to ensure the model is properly accessible
  Investor =
    mongoose.models.investor || mongoose.model('investor', InvestorSchema);
} else {
  // We're on the client side - create a mock implementation
  Investor = {
    async save() {
      throw new Error(
        'Database operations should be done through API routes, not directly in client components'
      );
    },
  };
}

module.exports = { Investor };
// export const Investor = mongoose.model('investor', InvestorSchema);
