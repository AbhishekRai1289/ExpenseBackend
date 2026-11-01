const jwt = require('jsonwebtoken');

/**
 * Generates a signed JSON Web Token (JWT)
 * @param {string|import('mongoose').Types.ObjectId} userId - MongoDB _id of the user
 * @returns {string} Signed JWT token
 */
const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
};

module.exports = generateToken;