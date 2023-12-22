// models/chart.js

const mongoose = require('mongoose');

const liabilitiesCategoriesSchema = new mongoose.Schema({
  categoryName: { type: String, required: true },
  chartId: { type: String, default: '' },
  parentId: { type: String, default: '' },
  type: { type: String, default: 'dynamic' },
});

const LiabilityCategories = mongoose.models.LiabilitiesCategories || mongoose.model('LiabilitiesCategories', liabilitiesCategoriesSchema);

export default LiabilityCategories;
