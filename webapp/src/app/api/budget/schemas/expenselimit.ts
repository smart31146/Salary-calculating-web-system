// models/chart.js

const mongoose = require('mongoose');

const expenseLimitSchema = new mongoose.Schema({
  upper: { type: Number, required: true },
  chartId: { type: String, required: true },
  lower: { type: Number, required: true },
  categoryId: { type: String, required: true },
});

const ExpenseLimit = mongoose.models.ExpenseLimit || mongoose.model('ExpenseLimit', expenseLimitSchema);

export default ExpenseLimit;
