/**
 * @file donorMatchingService.js
 * @description Core matching engine to find compatible, eligible donors.
 */
const { db } = require('../config/db');
const { getCompatibleDonors, isEligibleByDate } = require('../utils/bloodCompatibility');

async function matchDonors(request) {
  try {
    const compatibleGroups = getCompatibleDonors(request.bloodGroup);
    if (!compatibleGroups.length) return [];

    const donorsRef = db.collection('donors');
    let snapshot;

    // 1. Try to find donors in the SAME CITY first
    console.log(`Searching for donors in ${request.city}...`);
    snapshot = await donorsRef
      .where('city', '==', request.city)
      .where('bloodGroup', 'in', compatibleGroups)
      .where('isAvailable', '==', true)
      .where('consent', '==', true)
      .get();

    // 2. STATEWIDE FALLBACK: If no local donors found, search all of Karnataka
    if (snapshot.empty) {
      console.log(`No donors found in ${request.city}. Expanding search to all of Karnataka...`);
      snapshot = await donorsRef
        .where('state', '==', 'Karnataka') // Requires donors to have a 'state' field
        .where('bloodGroup', 'in', compatibleGroups)
        .where('isAvailable', '==', true)
        .where('consent', '==', true)
        .get();
    }

    if (snapshot.empty) return [];

    const matchedDonors = [];
    snapshot.forEach(doc => {
      const donor = { id: doc.id, ...doc.data() };
      if (isEligibleByDate(donor.lastDonationDate, 90)) {
        matchedDonors.push({
          donorId: donor.id,
          name: donor.name, 
          email: donor.email,
          bloodGroup: donor.bloodGroup,
          city: donor.city, // Send city so patient knows where they are
          area: donor.area,
          lastDonationDate: donor.lastDonationDate
        });
      }
    });

    matchedDonors.sort((a, b) => {
      if (!a.lastDonationDate) return -1;
      if (!b.lastDonationDate) return 1;
      return new Date(a.lastDonationDate) - new Date(b.lastDonationDate);
    });

    return matchedDonors.slice(0, 20);
  } catch (error) {
    console.error('Error in matchDonors:', error);
    throw new Error('Failed to match donors');
  }
}

module.exports = { matchDonors };