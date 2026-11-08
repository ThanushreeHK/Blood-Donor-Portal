/**
 * @file Donor.js
 * @description Firestore model for the 'donors' collection.
 */
const { db, serverTimestamp } = require('../config/db');

const COLLECTION = 'donors';

/**
 * Creates a new donor profile.
 * @param {Object} data - Donor data (userId, bloodGroup, city, area, isAvailable, consent, etc.)
 * @returns {Promise<string>} The new donor ID
 */
async function createDonor(data) {
  const donorRef = await db.collection(COLLECTION).add({
    ...data,
    createdAt: serverTimestamp(),
  });
  return donorRef.id;
}

/**
 * Finds a donor profile by the associated User ID.
 * @param {string} userId 
 * @returns {Promise<Object|null>}
 */
async function getByUserId(userId) {
  const snapshot = await db.collection(COLLECTION).where('userId', '==', userId).limit(1).get();
  if (snapshot.empty) return null;
  
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() };
}

/**
 * Finds compatible donors in a specific city.
 * (This is used by our matching engine, but we put the raw query here).
 * @param {string} city 
 * @param {string[]} bloodGroups 
 * @returns {Promise<Array>}
 */
async function findByCityAndGroups(city, bloodGroups) {
  const snapshot = await db.collection(COLLECTION)
    .where('city', '==', city)
    .where('bloodGroup', 'in', bloodGroups)
    .where('isAvailable', '==', true)
    .where('consent', '==', true)
    .get();
    
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

module.exports = { createDonor, getByUserId, findByCityAndGroups };