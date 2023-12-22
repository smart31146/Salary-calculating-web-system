const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  expense: {
    type: String,
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
  active: {
    type: Boolean,
    required: true,
    default: true,
  },
});

const Expense = mongoose.models.Expense || mongoose.model('Expense', expenseSchema);

export default Expense;
