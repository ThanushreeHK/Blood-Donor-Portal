/**
 * @file server.js
 * @description Entry point for the Blood Donor Portal API.
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// 1. Security & Utility Middleware
app.use(helmet()); // Sets secure HTTP headers
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' })); // Allows React to connect
app.use(morgan('dev')); // Logs API requests to the console
app.use(express.json({ limit: '1mb' })); // Parses incoming JSON

// 2. Health Check Route
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', version: '1.0.0', message: 'BloodLink API is running' });
});

// 3. Routes (We will uncomment these as we build them)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/donors', require('./routes/donorRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));
app.use('/api/hospitals', require('./routes/hospitalRoutes'));
app.use('/api/inventory', require('./routes/inventoryRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// 4. Error Handling (Must be at the very end)
app.use(notFound);
app.use(errorHandler);

// 5. Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`🔗 http://localhost:${PORT}`);
});