const Expense = require('../model/expense_form_model');

const addExpenseForm = async (req, res) => {
  try {
    const { to, from, distance, orderbooked, date, location } = req.body;

    // 1. Normalize target date to midnight
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    // 2. Prevent duplicate entries for the same date
    const nextDay = new Date(targetDate);
    nextDay.setDate(targetDate.getDate() + 1);

    const existingExpense = await Expense.findOne({
      date: { $gte: targetDate, $lt: nextDay }
    });

    if (existingExpense) {
      return res.status(400).json({ message: "An expense form for this date already exists." });
    }

    // 3. Find the most recent record prior to targetDate
    const lastExpense = await Expense.findOne({
      date: { $lt: targetDate }
    }).sort({ date: -1 });

    // 4. Block if previous date is missing
    if (lastExpense) {
      const lastDate = new Date(lastExpense.date);
      lastDate.setHours(0, 0, 0, 0);

      const dayDifference = Math.round((targetDate - lastDate) / (1000 * 60 * 60 * 24));

      // If more than 1 day apart, previous date is missing
      if (dayDifference > 1) {
        return res.status(404).json({ message: "Please Fill Previous Date Expense Form" });
      }
    }

    // 5. Calculate and save
    const da = location === "in" ? 300 : 1200;
    const fare = Number(distance) * 2.5;
    const totalAmount = fare + da;

    const newExpense = new Expense({
      to,
      from,
      distance: Number(distance),
      da,
      orderbooked: Number(orderbooked),
      date: targetDate,
      fare,
      totalAmount,
      location
    });

    await newExpense.save();
    return res.status(201).json(newExpense);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getExpenseForms = async (req, res) => {
  try {
    const { location, date, month, year, fromDate, toDate, from } = req.query;

    const filter = {};

    // 1. Filter by Location (case-insensitive)
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    // 2. Filter by 'from' (if it represents a sender, vendor, or user)
    if (from) {
      filter.from = { $regex: from, $options: 'i' };
    }

    // 3. Date Filtering
    if (date) {
      // Matches the exact single day (00:00:00 to 23:59:59)
      const startOfDay = new Date(date);
      startOfDay.setUTCHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setUTCHours(23, 59, 59, 999);

      filter.date = { $gte: startOfDay, $lte: endOfDay };
    } else if (month) {
      // Matches an entire month (e.g., month=10, year=2026)
      const targetYear = parseInt(year, 10) || new Date().getUTCFullYear();
      const targetMonth = parseInt(month, 10) - 1; // JavaScript months are 0-indexed (0 = Jan, 9 = Oct)

      const startOfMonth = new Date(Date.UTC(targetYear, targetMonth, 1));
      const endOfMonth = new Date(Date.UTC(targetYear, targetMonth + 1, 0, 23, 59, 59, 999));

      filter.date = { $gte: startOfMonth, $lte: endOfMonth };
    } else if (fromDate || toDate) {
      // If 'from' meant a start date range (e.g., fromDate to toDate)
      filter.date = {};
      if (fromDate) filter.date.$gte = new Date(fromDate);
      if (toDate) filter.date.$lte = new Date(toDate);
    }

    const expenses = await Expense.find(filter).sort({ date: -1 });

    res.status(200).json({
      count: expenses.length,
      data: expenses,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addExpenseForm = addExpenseForm;
exports.getExpenseForms = getExpenseForms;