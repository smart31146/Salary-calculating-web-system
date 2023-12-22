const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
  incomeSource: {
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
});

const Income = mongoose.models.Income || mongoose.model('Income', incomeSchema);

export default Income;
