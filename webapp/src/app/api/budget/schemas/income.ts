const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
  name: {
        type: String,
        required: true,
    },
  monthlyAmount: {
    type: Number,
    required: true,
  },
  note: {
    type: String,
    required: false,
  },
  chartId: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
    default: true,
  },
});

const BudgetIncome = mongoose.models.BudgetIncome || mongoose.model('BudgetIncome', incomeSchema);

export default BudgetIncome;
