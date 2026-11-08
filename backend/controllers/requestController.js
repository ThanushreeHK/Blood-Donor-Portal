/**
 * @file requestController.js
 * @description Handles blood requests, matching, email notifications, accept/decline actions, and recording donations.
 */
const { createRequest, getRequestById } = require('../models/BloodRequest');
const { matchDonors } = require('../services/donorMatchingService');
const { findById } = require('../models/User');
const { sendMatchEmail, sendContactRevealEmail, logNotification } = require('../services/notificationService');
const { generateActionToken, verifyActionToken } = require('../utils/generateToken');
const { recordDonation } = require('../models/Donation'); // <-- Added for history
const { db } = require('../config/db');

/**
 * @route POST /api/requests
 * @desc Create a new blood request, find matches, and email them
 */
async function createNewRequest(req, res) {
  try {
    const { patientName, bloodGroup, units, hospital, city, urgency, contactName, contactPhone, notes } = req.body;

// Format the city to Title Case (e.g., "DAVANAGERE" -> "Davanagere")
const formattedCity = city.trim().charAt(0).toUpperCase() + city.trim().slice(1).toLowerCase();

    const user = await findById(req.user.uid);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Requester not found' });
    }

    const requestId = await createRequest({
      requesterId: req.user.uid,
      requesterRole: user.role,
      requesterEmail: user.email,
      patientName, bloodGroup, units, hospital, city, urgency, contactName, contactPhone, notes: notes || '',
      matchedDonorIds: [],
      acceptedDonorId: null
    });

    const requestData = { bloodGroup, city, hospital, urgency };

    console.log(`Finding donors for request ${requestId} (${bloodGroup} in ${city})...`);
    const matchedDonors = await matchDonors(requestData);

    const matchedDonorIds = [];
    for (const donor of matchedDonors) {
      matchedDonorIds.push(donor.donorId);
      const acceptToken = generateActionToken(requestId, donor.donorId, 'accept');
      const declineToken = generateActionToken(requestId, donor.donorId, 'decline');

      await sendMatchEmail(donor, requestData, acceptToken, declineToken);
      await logNotification(donor.donorId, requestId, 'email', 'sent');
    }

    await db.collection('requests').doc(requestId).update({ matchedDonorIds });

    res.status(201).json({
      success: true,
      message: `Request created. ${matchedDonors.length} compatible donors notified.`,
      data: { requestId, matchedCount: matchedDonors.length }
    });

  } catch (error) {
    console.error('Create Request error:', error);
    res.status(500).json({ success: false, message: 'Server error creating request', details: error.message });
  }
}

/**
 * @route GET /api/requests
 * @desc Get requests (Patient sees their own, Admin sees all)
 */
async function listRequests(req, res) {
  try {
    let query = db.collection('requests');

    if (req.user.role === 'patient') {
      query = query.where('requesterId', '==', req.user.uid);
    }

    const snapshot = await query.get();
    const requests = [];
    
    for (const doc of snapshot.docs) {
      const requestData = { id: doc.id, ...doc.data() };

      // Reveal donor contact if matched
      if (requestData.status === 'matched' && requestData.acceptedDonorId) {
        const donorDoc = await db.collection('donors').doc(requestData.acceptedDonorId).get();
        if (donorDoc.exists) {
          const donor = donorDoc.data();
          requestData.donorContact = {
            name: donor.name,
            phone: donor.phone,
            email: donor.email
          };
        }
      }
      requests.push(requestData);
    }

    requests.sort((a, b) => {
      const timeA = a.createdAt?._seconds || 0;
      const timeB = b.createdAt?._seconds || 0;
      return timeB - timeA;
    });

    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    console.error('List requests error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching requests', details: error.message });
  }
}

/**
 * @route POST /api/requests/accept
 * @desc Donor clicks "Accept" in email
 */
async function handleAccept(req, res) {
  console.log("\n🚨 SERVER RECEIVED ACCEPT REQUEST! 🚨");
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ success: false, message: 'Token required' });

    const decoded = verifyActionToken(token);
    if (decoded.action !== 'accept') return res.status(400).json({ success: false, message: 'Invalid token action' });

    const { requestId, donorId } = decoded;
    const request = await getRequestById(requestId);
    const donorDoc = await db.collection('donors').doc(donorId).get();
    
    if (!request || !donorDoc.exists) {
      return res.status(404).json({ success: false, message: 'Request or Donor not found' });
    }
    const donor = donorDoc.data();

    await db.collection('requests').doc(requestId).update({
      status: 'matched',
      acceptedDonorId: donorId
    });

    await sendContactRevealEmail(request.requesterEmail, {
      name: donor.name,
      phone: donor.phone,
      email: donor.email
    });

    // Record the donation in the donor's history
    await recordDonation({
      donorId: donorId,
      requestId: requestId,
      hospitalId: request.hospital,
      units: request.units || 1,
      status: 'completed'
    });

    await logNotification(donorId, requestId, 'email', 'accepted');

    res.status(200).json({ 
      success: true, 
      message: 'Request accepted successfully. The patient has been notified with your contact details.' 
    });

  } catch (error) {
    console.error('Accept error:', error);
    res.status(400).json({ 
      success: false, 
      message: 'Invalid or expired token',
      details: error.message 
    });
  }
}

/**
 * @route POST /api/requests/decline
 * @desc Donor clicks "Decline" in email
 */
async function handleDecline(req, res) {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ success: false, message: 'Token required' });

    const decoded = verifyActionToken(token);
    if (decoded.action !== 'decline') return res.status(400).json({ success: false, message: 'Invalid token action' });

    await logNotification(decoded.donorId, decoded.requestId, 'email', 'declined');

    res.status(200).json({ success: true, message: 'Request declined. Thank you for your response.' });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid or expired token', details: error.message });
  }
}

module.exports = { createNewRequest, listRequests, handleAccept, handleDecline };