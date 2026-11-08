/**
 * @file donorRoutes.js
 * @description Routes for donor operations.
 */
const express = require('express');
const { 
  createProfile, 
  getProfile, 
  updateProfile, 
  toggleAvailability, 
  getHistory 
} = require('../controllers/donorController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

// All donor routes require the user to be logged in (has a valid token)
router.use(protect);

// Create a new donor profile (Only users with role 'donor' can do this)
router.post('/', authorize('donor'), createProfile);

// Get the logged-in donor's profile
router.get('/me', getProfile);

// Update the logged-in donor's profile
router.put('/me', updateProfile);

// Toggle the donor's availability on/off
router.patch('/me/availability', toggleAvailability);

// Get the logged-in donor's donation history
router.get('/me/history', getHistory);

module.exports = router;