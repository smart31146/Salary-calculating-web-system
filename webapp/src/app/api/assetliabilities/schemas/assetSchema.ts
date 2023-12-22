const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  asset: {
    type: String,
    required: true,
  },
  financialInstitution: {
    type: String,
    required: true,
  },
  amount: {
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

const Asset = mongoose.models.Asset || mongoose.model('Asset', assetSchema);

export default Asset;
