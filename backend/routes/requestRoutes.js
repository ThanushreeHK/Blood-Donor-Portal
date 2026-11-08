/**
 * @file requestRoutes.js
 * @description Routes for blood requests.
 */
const express = require('express');
const { createNewRequest, handleAccept, handleDecline, listRequests } = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

// Create a request (Patients/Hospitals only)
router.post('/', protect, authorize('patient', 'hospital'), createNewRequest);

// List requests (Protected - role-aware logic inside the controller)
router.get('/', protect, listRequests);

// Accept/Decline (Public - secured by JWT action token in the body)
router.post('/accept', handleAccept);
router.post('/decline', handleDecline);

module.exports = router;