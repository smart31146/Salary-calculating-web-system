// models/chart.js

const mongoose = require('mongoose');

const chartSchema = new mongoose.Schema({
  chartName: { type: String, required: true },
  pieChartName: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now },
  userId: { type: String, required: true },
});

const BudgetChart = mongoose.models.BudgetChart || mongoose.model('BudgetChart', chartSchema);

export default BudgetChart;
