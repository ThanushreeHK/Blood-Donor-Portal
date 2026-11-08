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
    let serviceAccount;

    // 1. Check if we are in production (Render) using the Environment Variable
    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
      
      // Fix for Render sometimes escaping the newlines in the private key
      if (serviceAccount.private_key) {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
      }
    } 
    // 2. Otherwise, fallback to local file for development
    else {
      const serviceAccountPath = path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT || './serviceAccountKey.json');
      
      if (!fs.existsSync(serviceAccountPath)) {
        throw new Error(`Firebase service account key not found at: ${serviceAccountPath}`);
      }
      serviceAccount = require(serviceAccountPath);
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('✅ Firebase Admin Initialized');
  } catch (error) {
    console.error('❌ Firebase initialization error:', error.message);
    process.exit(1);
  }
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };