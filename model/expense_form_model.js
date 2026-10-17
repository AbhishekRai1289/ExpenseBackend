const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExpenseSchema = new Schema({
  to: { type: String, required: true },
  from: { type: String, required: true },
  distance: { type: Number, required: true },
  da: { type: Number, required: true },
  orderbooked: { type: Number, required: true },
  fare: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true }
});

const Expense = mongoose.model('Expense_form', ExpenseSchema);
module.exports = Expense;
