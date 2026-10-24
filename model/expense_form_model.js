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
  location: { type: String, required: true },
});

const extraExpenseSchema = new Schema(
  {
    post: {
      type: Number,
      required: true,
      default: 0,
    },
    photocopy: {
      type: Number,
      required: true,
      default: 0,
    },
    mobileAllo: {
      type: Number,
      required: true,
      default: 0,
    },
    totalExpense: {
      type: Number,
      required: true,
      default: 0,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

extraExpenseSchema.pre('save', async function () {
  this.totalExpense = (this.post || 0) + (this.photocopy || 0) + (this.mobileAllo || 0);
});

// Explicitly bind to your MongoDB collection name (3rd parameter)
const Expense = mongoose.model('Expense_form', ExpenseSchema, 'expense_forms');
const ExtraExpense = mongoose.model('ExtraExpense', extraExpenseSchema, 'extraexpenses');

// Export both models together
module.exports = {
  Expense,
  ExtraExpense,
};