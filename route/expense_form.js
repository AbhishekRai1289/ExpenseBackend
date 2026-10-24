const express = require('express');
const router = express.Router();
const { addExpenseForm } = require('../controller/expense_form');
const { getExpenseForms } = require('../controller/expense_form');
const { extraExpense } = require('../controller/expense_form');

// Expense Form Route
router.post('/expense-form', addExpenseForm);
router.get('/get-expense-forms', getExpenseForms);
router.post('/extra-expense-forms', extraExpense);

module.exports = router;
