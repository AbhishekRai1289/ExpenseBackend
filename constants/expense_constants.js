// Location types
const LOCATIONS = Object.freeze({
  LOCAL: 'in',
  OUTSTATION: 'out',
});

// Daily Allowance (DA) rates based on location
const DA_RATES = Object.freeze({
  [LOCATIONS.LOCAL]: 300,
  [LOCATIONS.OUTSTATION]: 1200,
});

// Mileage/travel fare rate (multiplier per unit of distance)
const FARE_RATE_PER_KM = 2.5;

// User roles for authorization
const USER_ROLES = Object.freeze({
  USER: 'user',
  ADMIN: 'admin',
  MANAGER: 'manager',
});

// HTTP response status messages
const MESSAGES = Object.freeze({
  EXPENSE_CREATED: 'Expense submitted successfully',
  EXPENSE_UPDATED: 'Expense updated successfully',
  EXPENSE_DELETED: 'Expense deleted successfully',
  EXPENSE_NOT_FOUND: 'Expense record not found',
  DATE_GAP_ERROR: 'Please Fill Previous Date Expense Form',
  PRIOR_DATE_ERROR: 'Cannot insert a date before the earliest existing record.',
  UNAUTHORIZED: 'Access denied. Valid token required.',
  FORBIDDEN: 'You do not have permission to perform this action.',
});

// Time and date utility constants (in milliseconds)
const TIME = Object.freeze({
  ONE_DAY_MS: 1000 * 60 * 60 * 24,
});

module.exports = {
  LOCATIONS,
  DA_RATES,
  FARE_RATE_PER_KM,
  USER_ROLES,
  MESSAGES,
  TIME,
};