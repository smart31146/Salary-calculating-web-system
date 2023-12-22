// models/chart.js

import mongoose from 'mongoose';

const chartSchema = new mongoose.Schema({
  chartName: { type: String, required: true },
  pieChartName: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now },
  userId: { type: String, required: true },
});

const Chart = mongoose.models.Chart || mongoose.model('Chart', chartSchema);

export default Chart;
