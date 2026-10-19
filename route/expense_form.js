const express = require('express');
const router = express.Router();
const { addExpenseForm } = require('../controller/expense_form');
const { getExpenseForms } = require('../controller/expense_form');
const { fixDates } = require('../controller/expense_form');
// Expense Form Route
router.post('/expense-form', addExpenseForm);
router.get('/get-expense-forms', getExpenseForms);
router.get('/fix-dates', fixDates);


module.exports = router;
