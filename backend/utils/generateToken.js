/**
 * @file generateToken.js
 * @description Handles JWT generation and verification for auth and email actions.
 */
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_prod';

function generateToken(payload, expiresIn = '7d') {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

function generateActionToken(requestId, donorId, action) {
  return jwt.sign({ requestId, donorId, action }, JWT_SECRET, { expiresIn: '24h' });
}

function verifyActionToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = {
  generateToken,
  verifyToken,
  generateActionToken,
  verifyActionToken
};