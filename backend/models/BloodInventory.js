/**
 * @file BloodInventory.js
 * @description Firestore model for hospital blood inventory.
 */
const { db } = require('../config/db');
const COLLECTION = 'inventory';

// We use a specific Document ID format: {hospitalId}_{bloodGroup} so it's easy to query.
async function updateInventory(hospitalId, bloodGroup, units) {
  const docId = `${hospitalId}_${bloodGroup}`;
  const docRef = db.collection(COLLECTION).doc(docId);
  
  const doc = await docRef.get();
  if (doc.exists) {
    await docRef.update({ units: parseInt(units), updatedAt: new Date() });
  } else {
    await docRef.set({
      hospitalId,
      bloodGroup,
      units: parseInt(units),
      updatedAt: new Date()
    });
  }
}

async function getInventoryByHospital(hospitalId) {
  const snapshot = await db.collection(COLLECTION).where('hospitalId', '==', hospitalId).get();
  const inventory = {};
  
  // Initialize all 8 groups to 0
  ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].forEach(bg => {
    inventory[bg] = 0;
  });

  // Overwrite with actual DB values
  snapshot.forEach(doc => {
    const data = doc.data();
    inventory[data.bloodGroup] = data.units;
  });

  return inventory;
}

module.exports = { updateInventory, getInventoryByHospital };