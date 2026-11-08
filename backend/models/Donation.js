const { db, serverTimestamp } = require('../config/db');
const COLLECTION = 'donations';

async function recordDonation(data) {
  const ref = await db.collection(COLLECTION).add({
    ...data,
    donatedAt: serverTimestamp()
  });
  return ref.id;
}

async function getByDonor(donorId) {
  const snapshot = await db.collection(COLLECTION)
    .where('donorId', '==', donorId)
    .get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

module.exports = { recordDonation, getByDonor };