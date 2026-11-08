/**
 * @file roleMiddleware.js
 * @description Restricts routes based on user roles.
 */

/**
 * Usage: router.get('/admin', protect, authorize('admin'), ...)
 * @param {...string} roles - Allowed roles
 */
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Access denied. Role '${req.user?.role}' is not allowed.` 
      });
    }
    next();
  };
}

module.exports = { authorize };