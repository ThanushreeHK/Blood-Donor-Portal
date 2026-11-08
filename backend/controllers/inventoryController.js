/**
 * @file inventoryController.js
 * @description Handles hospital blood inventory operations.
 */
const { updateInventory, getInventoryByHospital } = require('../models/BloodInventory');
const { getByUserId } = require('../models/Hospital');

async function getInventory(req, res) {
  try {
    const hospital = await getByUserId(req.user.uid);
    if (!hospital) return res.status(404).json({ success: false, message: 'Hospital not found' });

    const inventory = await getInventoryByHospital(hospital.id);
    res.status(200).json({ success: true, data: inventory });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching inventory' });
  }
}

async function updateStock(req, res) {
  try {
    const { bloodGroup, units } = req.body;
    
    if (!bloodGroup || units === undefined) {
      return res.status(400).json({ success: false, message: 'Blood group and units required' });
    }

    const hospital = await getByUserId(req.user.uid);
    if (!hospital) return res.status(404).json({ success: false, message: 'Hospital not found' });

    await updateInventory(hospital.id, bloodGroup, units);
    
    // Fetch the updated inventory to return to the frontend
    const updatedInventory = await getInventoryByHospital(hospital.id);

    res.status(200).json({ success: true, message: 'Inventory updated', data: updatedInventory });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error updating inventory', details: error.message });
  }
}

module.exports = { getInventory, updateStock };