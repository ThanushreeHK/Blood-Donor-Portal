const express = require('express');
const { getStats, listHospitals, verifyHospital, listUsers } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

// All admin routes require login AND the 'admin' role
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getStats);
router.get('/hospitals', listHospitals);
router.patch('/hospitals/:id/verify', verifyHospital);
router.get('/users', listUsers);

module.exports = router;