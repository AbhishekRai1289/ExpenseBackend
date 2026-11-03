const { Expense, ExtraExpense } = require('../model/expense_form_model');
const {
  LOCATIONS,
  DA_RATES,
  FARE_RATE_PER_KM,
  MESSAGES,
  TIME,
} = require('../constants/expense_constants');

/**
 * Create or update an existing daily expense form
 */
const addExpenseForm = async (req, res) => {
  try {
    const { to, from, distance, orderbooked, date, location } = req.body;
    const userId = req.user ? req.user._id : null; // Populated by authMiddleware

    // 1. Calculations using constants
    const numDistance = Number(distance) || 0;
    const da = DA_RATES[location] ?? DA_RATES[LOCATIONS.LOCAL];
    const fare = numDistance * FARE_RATE_PER_KM;
    const totalAmount = fare + da;

    // 2. Normalize target date to midnight UTC
    const targetDate = new Date(date);
    targetDate.setUTCHours(0, 0, 0, 0);

    const expenseData = {
      to,
      from,
      distance: numDistance,
      da,
      orderbooked: Number(orderbooked) || 0,
      date: targetDate,
      fare,
      totalAmount,
      location,
      ...(userId && { userId }),
    };

    // 3. Prevent duplicate entries for the same date (scoped to user)
    const nextDay = new Date(targetDate);
    nextDay.setUTCDate(targetDate.getUTCDate() + 1);

    const userScope = userId ? { userId } : {};

    const existingExpense = await Expense.findOne({
      ...userScope,
      date: { $gte: targetDate, $lt: nextDay },
    });

    if (existingExpense) {
      const updatedExpense = await Expense.findByIdAndUpdate(
        existingExpense._id,
        { $set: expenseData },
        { new: true, runValidators: true }
      );
      return res.status(200).json({
        message: MESSAGES.EXPENSE_UPDATED || "Expense updated successfully",
        data: updatedExpense,
      });
    }

    // 4. Sequential date validation (scoped to user)
    const totalRecords = await Expense.countDocuments(userScope);

    if (totalRecords > 0) {
      const lastExpense = await Expense.findOne({
        ...userScope,
        date: { $lt: targetDate },
      }).sort({ date: -1 });

      if (lastExpense) {
        const lastDate = new Date(lastExpense.date);
        lastDate.setUTCHours(0, 0, 0, 0);

        const dayDifference = Math.round((targetDate - lastDate) / TIME.ONE_DAY_MS);

        if (dayDifference > 1) {
          return res.status(400).json({
            message: MESSAGES.DATE_GAP_ERROR || "Please Fill Previous Date Expense Form",
          });
        }
      } else {
        return res.status(400).json({
          message: MESSAGES.PRIOR_DATE_ERROR || "Cannot insert a date before the earliest existing record.",
        });
      }
    }

    const newExpense = new Expense(expenseData);
    await newExpense.save();

    return res.status(201).json({
      message: MESSAGES.EXPENSE_CREATED || "Expense submitted successfully",
      data: newExpense,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Retrieve expense forms with filtering and user scope
 */
const getExpenseForms = async (req, res) => {
  try {
    const { location, date, month, year, fromDate, toDate, from } = req.query;
    const userId = req.user ? req.user._id : null;

    const filter = {};

    if (userId) {
      filter.userId = userId;
    }

    // 1. Filter by Location
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    // 2. Filter by Origin / Station
    if (from) {
      filter.$or = [
        { from: { $regex: from, $options: 'i' } },
        { fromStation: { $regex: from, $options: 'i' } },
      ];
    }

    // 3. Date Filtering
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setUTCHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setUTCHours(23, 59, 59, 999);

      filter.date = { $gte: startOfDay, $lte: endOfDay };
    } else if (month) {
      const targetYear = parseInt(year, 10) || new Date().getUTCFullYear();
      const targetMonth = parseInt(month, 10) - 1;

      const startOfMonth = new Date(Date.UTC(targetYear, targetMonth, 1));
      const endOfMonth = new Date(Date.UTC(targetYear, targetMonth + 1, 0, 23, 59, 59, 999));

      filter.date = { $gte: startOfMonth, $lte: endOfMonth };
    } else if (fromDate || toDate) {
      filter.date = {};
      if (fromDate) {
        const start = new Date(fromDate);
        start.setUTCHours(0, 0, 0, 0);
        filter.date.$gte = start;
      }
      if (toDate) {
        const end = new Date(toDate);
        end.setUTCHours(23, 59, 59, 999);
        filter.date.$lte = end;
      }
    }

    const expenses = await Expense.find(filter).sort({ date: -1 });

    // return res.status(200).json({
    //   count: expenses.length,
    //   data: expenses,
    // });
    return res.status(200).json(expenses);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Record miscellaneous or operational expenses
 */
const extraExpense = async (req, res) => {
  try {
    const { post, photocopy, mobileAllo, date } = req.body;
    const userId = req.user ? req.user._id : null;

    const parsedPost = Number(post) || 0;
    const parsedPhotocopy = Number(photocopy) || 0;
    const parsedMobileAllo = Number(mobileAllo) || 0;

    const totalExpense = parsedPost + parsedPhotocopy + parsedMobileAllo;

    const expenseDate = date ? new Date(date) : new Date();

    const newExtraExpense = new ExtraExpense({
      post: parsedPost,
      photocopy: parsedPhotocopy,
      mobileAllo: parsedMobileAllo,
      totalExpense,
      date: expenseDate,
      ...(userId && { userId }),
    });

    const savedExpense = await newExtraExpense.save();

    return res.status(201).json({
      success: true,
      message: 'Extra expense saved successfully',
      data: savedExpense,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  addExpenseForm,
  getExpenseForms,
  extraExpense,
};