// models/chart.js

import mongoose from 'mongoose';

const assetCategoriesSchema = new mongoose.Schema({
  categoryName: { type: String, required: true },
  chartId: { type: String, default: '' },
  parentId: { type: String, default: '' },
  type: { type: String, default: 'dynamic' },
});

const AssetCategories = mongoose.models.AssetCategories || mongoose.model('AssetCategories', assetCategoriesSchema);

export default AssetCategories;
