/**
 * @file firebase.js
 * @description Initializes the Firebase Admin SDK.
 */
const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

if (!admin.apps.length) {
  try {
    const serviceAccountPath = path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT || './serviceAccountKey.json');
    
    if (!fs.existsSync(serviceAccountPath)) {
      throw new Error(`Firebase service account key not found at: ${serviceAccountPath}`);
    }

    const serviceAccount = require(serviceAccountPath);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('✅ Firebase Admin Initialized');
  } catch (error) {
    console.error('❌ Firebase initialization error:', error.message);
    process.exit(1); // Stop the app if DB fails
  }
}

const db = admin.firestore();
const auth = admin.auth();

// THIS IS THE CRUCIAL PART:
module.exports = { admin, db, auth };