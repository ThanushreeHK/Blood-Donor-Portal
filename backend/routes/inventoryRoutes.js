/**
 * @file inventoryRoutes.js
 * @description Routes for hospital inventory.
 */
const express = require('express');
const { getInventory, updateStock } = require('../controllers/inventoryController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorize('hospital')); // Only hospitals can access this

router.get('/me', getInventory);
router.put('/me', updateStock);

module.exports = router;