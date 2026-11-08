require('dotenv').config();
const bcrypt = require('bcryptjs');
const { db } = require('../config/db');
const { createUser, findByEmail } = require('../models/User');
const { createHospital } = require('../models/Hospital');

const hospitals = [
  { name: "Bapuji Hospital", email: "bapuji@hospital.com", license: "LIC-001", address: "MCC B Block, Davanagere", phone: "1111111111" },
  { name: "SS Institute of Medical Sciences", email: "ssims@hospital.com", license: "LIC-002", address: "Jnanagangothri, Davanagere", phone: "2222222222" },
  { name: "JJM Medical College Hospital", email: "jjm@hospital.com", license: "LIC-003", address: "MCC B Block, Davanagere", phone: "3333333333" }
];

async function seed() {
  console.log("Seeding hospitals...");
  for (const h of hospitals) {
    const existing = await findByEmail(h.email);
    if (existing) {
      console.log(`- ${h.name} already exists.`);
      continue;
    }
    
    // Create user account for the hospital
    const passwordHash = await bcrypt.hash('Hospital@123', 10);
    const userId = await createUser({
      name: h.name, email: h.email, passwordHash, role: 'hospital', phone: h.phone, consent: true
    });

    // Create hospital profile
    await createHospital({
      userId, hospitalName: h.name, licenseNumber: h.license, city: 'Davanagere',
      address: h.address, contactPerson: h.name, phone: h.phone
    });

    // Manually verify them so they show up as verified
    const hospitalDoc = await db.collection('hospitals').where('userId', '==', userId).get();
    await db.collection('hospitals').doc(hospitalDoc.docs[0].id).update({ verified: true });

    console.log(`✅ Created ${h.name}`);
  }
  console.log("Done seeding hospitals!");
  process.exit(0);
}

seed();