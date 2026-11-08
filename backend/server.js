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
app.use(helmet()); 

// Allow both local development and your live GitHub Pages site
const allowedOrigins = [
  'http://localhost:5173',
  'https://thanushreehk.github.io' // <-- Your live frontend URL
];

app.use(cors({ 
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

app.use(morgan('dev')); 
app.use(express.json({ limit: '1mb' })); 

// 2. Health Check Route
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', version: '1.0.0', message: 'BloodLink API is running' });
});

// 3. Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/donors', require('./routes/donorRoutes'));
app.use('/api/patients', require('./routes/patientRoutes'));
app.use('/api/hospitals', require('./routes/hospitalRoutes'));
app.use('/api/inventory', require('./routes/inventoryRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// 4. Error Handling
app.use(notFound);
app.use(errorHandler);

// 5. Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});