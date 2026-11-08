/**
 * @file BloodRequest.js
 * @description Firestore model for the 'requests' collection.
 */
const { db, serverTimestamp } = require('../config/db');

const COLLECTION = 'requests';

/**
 * Creates a new blood request.
 * @param {Object} data 
 * @returns {Promise<string>} The new request ID
 */
async function createRequest(data) {
  const requestRef = await db.collection(COLLECTION).add({
    ...data,
    status: 'pending', // pending, matched, fulfilled, cancelled
    createdAt: serverTimestamp(),
  });
  return requestRef.id;
}

/**
 * Finds a request by ID.
 * @param {string} id 
 * @returns {Promise<Object|null>}
 */
async function getRequestById(id) {
  const doc = await db.collection(COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

module.exports = { createRequest, getRequestById };