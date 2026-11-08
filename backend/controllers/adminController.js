/**
 * @file adminController.js
 * @description Handles admin operations like stats, verifying hospitals, and managing users.
 */
const { db } = require('../config/db');

async function getStats(req, res) {
  try {
    const usersSnap = await db.collection('users').get();
    const donorsSnap = await db.collection('donors').get();
    const hospitalsSnap = await db.collection('hospitals').get();
    const requestsSnap = await db.collection('requests').get();

    let totalPatients = 0;
    usersSnap.forEach(doc => {
      if (doc.data().role === 'patient') totalPatients++;
    });

    let verifiedHospitals = 0;
    hospitalsSnap.forEach(doc => {
      if (doc.data().verified === true) verifiedHospitals++;
    });

    let pendingRequests = 0;
    requestsSnap.forEach(doc => {
      if (doc.data().status === 'pending') pendingRequests++;
    });

    res.status(200).json({
      success: true,
      data: {
        totalDonors: donorsSnap.size,
        totalPatients,
        totalHospitals: hospitalsSnap.size,
        verifiedHospitals,
        totalRequests: requestsSnap.size,
        pendingRequests
      }
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching stats' });
  }
}

async function listHospitals(req, res) {
  try {
    const snapshot = await db.collection('hospitals').get();
    const hospitals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json({ success: true, data: hospitals });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

async function verifyHospital(req, res) {
  try {
    const hospitalId = req.params.id;
    const docRef = db.collection('hospitals').doc(hospitalId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, message: 'Hospital not found' });
    }

    // Toggle verification
    const newVerifiedStatus = !doc.data().verified;
    await docRef.update({ verified: newVerifiedStatus });

    res.status(200).json({ 
      success: true, 
      message: `Hospital ${newVerifiedStatus ? 'Verified' : 'Unverified'} successfully` 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

async function listUsers(req, res) {
  try {
    const snapshot = await db.collection('users').get();
    const users = snapshot.docs.map(doc => {
      const data = doc.data();
      delete data.passwordHash; // Never send passwords
      return { id: doc.id, ...data };
    });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

module.exports = { getStats, listHospitals, verifyHospital, listUsers };