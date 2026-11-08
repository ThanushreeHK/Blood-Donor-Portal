require('dotenv').config();
const { db } = require('./config/db');

async function debug() {
  console.log("--- DATABASE DIAGNOSTICS ---");
  
  const allDonors = await db.collection('donors').get();
  console.log(`Total donors in DB: ${allDonors.size}`);

  const cityDonors = await db.collection('donors').where('city', '==', 'Davanagere').get();
  console.log(`Donors in 'Davanagere': ${cityDonors.size}`);

  console.log("\nAll donors in the database:");
  allDonors.forEach(doc => {
    const d = doc.data();
    console.log(`- ${d.name} | Blood: ${d.bloodGroup} | City: ${d.city} | Available: ${d.isAvailable}`);
  });

  process.exit(0);
}
debug();