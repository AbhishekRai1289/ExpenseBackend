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

const extraExpenseSchema = new Schema(
  {
    post: { 
      type: Number, 
      required: true, 
      default: 0 
    },
    photocopy: { 
      type: Number, 
      required: true, 
      default: 0 
    },
    mobileAllo: { 
      type: Number, 
      required: true, 
      default: 0 
    },
    totalExpense: { 
      type: Number, 
      required: true, 
      default: 0 
    },
    date: { 
      type: Date, 
      required: true, 
      default: Date.now 
    },
  },
  { 
    timestamps: true 
  }
);

extraExpenseSchema.pre('save', function (next) {
  this.totalExpense = (this.post || 0) + (this.photocopy || 0) + (this.mobileAllo || 0);
  next();
});

module.exports = mongoose.model('ExtraExpense', extraExpenseSchema);
const Expense = mongoose.model('Expense_form', ExpenseSchema);
module.exports = Expense;
