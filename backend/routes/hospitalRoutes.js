const express = require('express');
const { createProfile, getProfile } = require('../controllers/hospitalController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/', protect, authorize('hospital'), createProfile);
router.get('/me', protect, getProfile);

module.exports = router;