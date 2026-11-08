/**
 * @file db.js
 * @description Re-exports Firestore database instance.
 */
const { db, admin } = require('./firebase');

const serverTimestamp = () => admin.firestore.FieldValue.serverTimestamp();

async function testConnection() {
  try {
    const pingRef = db.collection('health').doc('ping');
    await pingRef.set({ lastPing: serverTimestamp() });
    console.log('✅ Firestore connection successful!');
  } catch (error) {
    console.error('❌ Firestore connection failed:', error.message);
  }
}

module.exports = { db, serverTimestamp, testConnection };