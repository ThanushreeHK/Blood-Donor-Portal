/**
 * @file User.js
 * @description Firestore model for the 'users' collection.
 */
const { db, serverTimestamp } = require('../config/db');

const COLLECTION = 'users';

/**
 * Creates a new user document.
 * @param {Object} data - User data (name, email, passwordHash, role, phone, consent)
 * @returns {Promise<string>} The new user ID
 */
async function createUser(data) {
  const userRef = await db.collection(COLLECTION).add({
    ...data,
    createdAt: serverTimestamp(),
  });
  return userRef.id;
}

/**
 * Finds a user by their email address.
 * @param {string} email 
 * @returns {Promise<Object|null>} User data with id, or null if not found
 */
async function findByEmail(email) {
  const snapshot = await db.collection(COLLECTION).where('email', '==', email).limit(1).get();
  if (snapshot.empty) return null;
  
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() };
}

/**
 * Finds a user by their ID.
 * @param {string} id 
 * @returns {Promise<Object|null>}
 */
async function findById(id) {
  const doc = await db.collection(COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

module.exports = { createUser, findByEmail, findById };