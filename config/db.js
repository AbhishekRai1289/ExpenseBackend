const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

// Event listeners for connection state changes
mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection error event: ${err.message}`);
});

// Graceful shutdown on application termination signals
const handleGracefulShutdown = async (signal) => {
  try {
    await mongoose.connection.close();
    console.log(`MongoDB connection closed due to ${signal}`);
    process.exit(0);
  } catch (err) {
    console.error(`Error closing MongoDB connection: ${err.message}`);
    process.exit(1);
  }
};

process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));
process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));

module.exports = connectDB;