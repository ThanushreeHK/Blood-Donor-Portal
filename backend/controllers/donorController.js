/**
 * @file donorController.js
 * @description Handles donor profile creation, updates, availability, and history.
 */
const { createDonor, getByUserId } = require('../models/Donor');
const { findById } = require('../models/User'); 
const { getByDonor } = require('../models/Donation'); 
const { db } = require('../config/db');

async function createProfile(req, res) {
  try {
    const existing = await getByUserId(req.user.uid);
    if (existing) return res.status(400).json({ success: false, message: 'Donor profile already exists' });
    if (!req.body.consent) return res.status(400).json({ success: false, message: 'Consent is required' });

    const user = await findById(req.user.uid);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const donorId = await createDonor({
      userId: req.user.uid,
      name: req.body.name,
      email: user.email, 
      bloodGroup: req.body.bloodGroup,
      city: req.body.city,
      state: req.body.state || 'Karnataka', // <-- Added State
      area: req.body.area,
      dob: req.body.dob,
      phone: req.body.phone,
      lastDonationDate: req.body.lastDonationDate || null,
      isAvailable: true,
      consent: true
    });

    res.status(201).json({ success: true, data: { donorId } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', details: error.message });
  }
}

async function getProfile(req, res) {
  try {
    const donor = await getByUserId(req.user.uid);
    if (!donor) return res.status(404).json({ success: false, message: 'Donor profile not found' });
    res.status(200).json({ success: true, data: donor });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

async function toggleAvailability(req, res) {
  try {
    const donor = await getByUserId(req.user.uid);
    if (!donor) return res.status(404).json({ success: false, message: 'Donor profile not found' });

    const newAvailability = !donor.isAvailable;
    await db.collection('donors').doc(donor.id).update({ isAvailable: newAvailability });

    res.status(200).json({ success: true, message: `Availability updated to ${newAvailability}`, data: { isAvailable: newAvailability } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

async function updateProfile(req, res) {
  try {
    const donor = await getByUserId(req.user.uid);
    if (!donor) return res.status(404).json({ success: false, message: 'Donor profile not found' });

    const allowedUpdates = ['name', 'bloodGroup', 'city', 'state', 'area', 'phone', 'dob', 'consent']; // <-- Added State
    const updates = {};
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    await db.collection('donors').doc(donor.id).update(updates);
    res.status(200).json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error updating profile' });
  }
}

async function getHistory(req, res) {
  try {
    const donor = await getByUserId(req.user.uid);
    if (!donor) return res.status(404).json({ success: false, message: 'Donor not found' });

    const history = await getByDonor(donor.id);
    history.sort((a, b) => (b.donatedAt?._seconds || 0) - (a.donatedAt?._seconds || 0));

    res.status(200).json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching history' });
  }
}

module.exports = { createProfile, getProfile, toggleAvailability, updateProfile, getHistory };