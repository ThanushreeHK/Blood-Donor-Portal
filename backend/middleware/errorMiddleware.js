/**
 * @file errorMiddleware.js
 * @description Central error handling for Express.
 */

// Catches 404 (Not Found) errors
function notFound(req, res, next) {
  res.status(404).json({ success: false, message: 'Endpoint Not Found' });
}

// Handles all other errors
function errorHandler(err, req, res, next) {
  console.error('API Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
}

module.exports = { notFound, errorHandler };