const { db, serverTimestamp } = require('../config/db');
const COLLECTION = 'hospitals';

async function createHospital(data) {
  const ref = await db.collection(COLLECTION).add({
    ...data,
    verified: false, // Admin must verify them later
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

async function getByUserId(userId) {
  const snapshot = await db.collection(COLLECTION).where('userId', '==', userId).limit(1).get();
  if (snapshot.empty) return null;
  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
}

module.exports = { createHospital, getByUserId };