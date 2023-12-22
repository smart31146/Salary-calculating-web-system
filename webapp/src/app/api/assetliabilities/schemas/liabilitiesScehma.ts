const mongoose = require('mongoose');

const liabilitySchema = new mongoose.Schema({
  liability: {
    type: String,
    required: true,
  },
  financialInstitution: {
    type: String,
    required: true,
  },
  limit: {
    type: Number,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
  monthlyAmount: {
    type: Number,
    required: true,
  },
  chartId: {
    type: String,
    required: true,
  },
  categoryId: {
    type: String,
    required: true,
  },
});

const Liability = mongoose.models.Liability || mongoose.model('Liability', liabilitySchema);

export default Liability;
