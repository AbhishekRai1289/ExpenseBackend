const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

    
// Routes
const expenseFormRoutes = require('./route/expense_form');
app.use('/api', expenseFormRoutes);


const authAPIRoute = require('./route/auth_route')
app.use('/api/auth', authAPIRoute);



// Server
const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
});