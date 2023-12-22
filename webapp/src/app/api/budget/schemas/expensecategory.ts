// models/chart.js

const mongoose = require('mongoose');

const expenseCategoriesSchema = new mongoose.Schema({
  categoryName: { type: String, required: true },
  chartId: { type: String, default: '' },
  parentId: { type: String, default: '' },
  type: { type: String, default: 'dynamic' },
});

const ExpenseCategory = mongoose.models.ExpenseCategory || mongoose.model('ExpenseCategory', expenseCategoriesSchema);

export default ExpenseCategory;
