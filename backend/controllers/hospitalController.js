const { createHospital, getByUserId } = require('../models/Hospital');
const { findById } = require('../models/User');

async function createProfile(req, res) {
  try {
    const existing = await getByUserId(req.user.uid);
    if (existing) return res.status(400).json({ success: false, message: 'Hospital profile exists' });

    const user = await findById(req.user.uid);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const hospitalId = await createHospital({
      userId: req.user.uid,
      hospitalName: req.body.hospitalName,
      licenseNumber: req.body.licenseNumber,
      city: req.body.city,
      address: req.body.address,
      contactPerson: req.body.contactPerson,
      phone: req.body.phone
    });

    res.status(201).json({ success: true, data: { hospitalId } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', details: error.message });
  }
}

async function getProfile(req, res) {
  try {
    const hospital = await getByUserId(req.user.uid);
    if (!hospital) return res.status(404).json({ success: false, message: 'Profile not found' });
    res.status(200).json({ success: true, data: hospital });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

module.exports = { createProfile, getProfile };