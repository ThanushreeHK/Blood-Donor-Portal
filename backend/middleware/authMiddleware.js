/**
 * @file authMiddleware.js
 * @description Protects routes by verifying JWT tokens.
 */
const { verifyToken } = require('../utils/generateToken');

function protect(req, res, next) {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded; 
    next(); 
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
}

// THIS LINE IS CRUCIAL:
module.exports = { protect };